package com.example.demo.book;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.importBook.ImportBook;
import com.example.demo.importBook.ImportBookService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final ImportBookService importBookService;

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id);
            return ResponseEntity.ok(book);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@RequestPart("book") String bookString, @RequestPart("image") MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Deserialize the book string to a Book object
        ObjectMapper objectMapper = new ObjectMapper();
        Book book;
        try {
            book = objectMapper.readValue(bookString, Book.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(null);
        }

        // Save the book to generate the ID
        Book createdBook = bookService.createBook(book);

        // Generate the new image filename
        String imageFilename = "image" + createdBook.getBookID() + "." + getFileExtension(image.getOriginalFilename());
        Path imagePath = Paths.get("images/" + imageFilename);

        // Ensure the directory exists
        Files.createDirectories(imagePath.getParent());

        // Save the image file
        Files.write(imagePath, image.getBytes());

        // Update the book's image path
        createdBook.setBookImage(imageFilename);
        bookService.updateBook(createdBook.getBookID(), createdBook);

        if(book.getStatus().getStatusID() == 2){
            // Create a new ImportBook record
            ImportBook importBook = new ImportBook();
            importBook.setImportDate(new Date()); // Set current date
            importBook.setImportQuantity(book.getBookQuantity()); // Set quantity from book
            importBook.setBook(createdBook); // Set the associated book

            // Save the import book record
            importBookService.createImportBook(importBook);
        }
        return ResponseEntity.ok(createdBook);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestPart("book") String bookString, @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        // Deserialize the book string to a Book object
        ObjectMapper objectMapper = new ObjectMapper();
        Book book;
        try {
            book = objectMapper.readValue(bookString, Book.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(null);
        }

        // Get the current book from the database
        Book currentBook = bookService.getBookById(id);
        if (currentBook == null) {
            return ResponseEntity.notFound().build();
        }

        // Handle the image update if an image file is provided
        if (image != null && !image.isEmpty()) {
            String imageFilename = "image" + id + "." + getFileExtension(image.getOriginalFilename());
            Path imagePath = Paths.get("images/" + imageFilename);

            // Ensure the directory exists
            Files.createDirectories(imagePath.getParent());

            // Save the image file
            Files.write(imagePath, image.getBytes());

            // Update the book's image path
            book.setBookImage(imageFilename);
        }

        // Calculate the difference in quantity
        int quantityDifference = book.getBookQuantity() - currentBook.getBookQuantity();
        if (quantityDifference > 0) {
            // Create a new ImportBook record if the new quantity is greater than the old quantity
            ImportBook importBook = new ImportBook();
            importBook.setImportDate(new Date()); // Set current date
            importBook.setImportQuantity(quantityDifference); // Set the quantity difference
            importBook.setBook(currentBook); // Set the associated book

            // Save the import book record
            importBookService.createImportBook(importBook);
        }

        // Update the book without changing the bookStar field
        Book updatedBook = bookService.updateBook(id, book);
        return ResponseEntity.ok(updatedBook);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search-by-bookname")
    public ResponseEntity<List<Book>> searchBooksByName(@RequestParam String book_name) {
        List<Book> books = bookService.searchBooksByName(book_name);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/search-by-category")
    public ResponseEntity<List<Book>> searchBooksByCategory(@RequestParam Long categoryID) {
        List<Book> books = bookService.searchBooksByCategoryId(categoryID);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/search-by-author")
    public ResponseEntity<List<Book>> searchBooksByAuthor(@RequestParam String book_author) {
        List<Book> books = bookService.searchBooksByAuthor(book_author);
        return ResponseEntity.ok(books);
    }

    @GetMapping(value = "/images/{filename}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        Path imagePath = Paths.get("images/" + filename);
        if (!Files.exists(imagePath)) {
            return ResponseEntity.notFound().build();
        }
        byte[] imageBytes = Files.readAllBytes(imagePath);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    private String getFileExtension(String filename) {
        if (filename == null) {
            return null;
        }
        String[] parts = filename.split("\\.");
        return parts.length > 1 ? parts[parts.length - 1] : "";
    }

    //THANG
    @PostMapping("/vote")
    public void voteBook(@RequestParam Long bookID, @RequestParam Long userID, @RequestParam Integer stars) {
        bookService.updateBookStars(bookID, userID, stars);
    }

    //most book vote
    @GetMapping("/most-voted-book")
    public ResponseEntity<?> getMostVotedBook() {
        List<Book> mostVotedBook = bookService.getMostVotedBook();
        return ResponseEntity.ok(mostVotedBook);
    }
}

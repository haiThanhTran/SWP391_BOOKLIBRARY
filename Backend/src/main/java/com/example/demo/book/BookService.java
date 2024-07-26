package com.example.demo.book;

import com.example.demo.exception.ResourceNotFoundException;
//import com.example.demo.cart.CartService;
//import com.example.demo.orderDetail.OrderDetailService;
//import com.example.demo.review.ReviewService;
//import com.example.demo.timeline.TimelineService;
//import com.example.demo.userBookStatus.UserBookStatusService;
import com.example.demo.status.Status;
import com.example.demo.status.StatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final StatusRepository statusRepository;

//    UserBookStatusService userBookStatusService;
//    CartService cartService;
//    ReviewService reviewService;
//    OrderDetailService orderDetailService;
//    TimelineService timelineService;

    public List<Book> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books;
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    @Transactional
    public Book createBook(Book book) {
        book.setBookStar(0);
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book updatedBook) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setBookName(updatedBook.getBookName());
                    book.setBookPrice(updatedBook.getBookPrice());
                    book.setBookQuantity(updatedBook.getBookQuantity());
                    book.setBookAuthor(updatedBook.getBookAuthor());
//                    book.setBookStar(updatedBook.getBookStar());
                    book.setStatus(updatedBook.getStatus());
                    book.setPage(updatedBook.getPage());
                    book.setLanguage(updatedBook.getLanguage());
                    book.setBookImage(updatedBook.getBookImage());
                    book.setDescription(updatedBook.getDescription());
                    book.setCategory(updatedBook.getCategory());
                    book.setPublisher(updatedBook.getPublisher());
//                    book.setStatus(updatedBook.getStatus());
                    return bookRepository.save(book);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    @Transactional
    public void deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
//            userBookStatusService.deleteUserBookStatusWithBookId(id);
//            cartService.deleteCartWithBookId(id);
//            reviewService.deleteReviewWithBookId(id);
//            orderDetailService.deleteOrderDetailWithBookId(id);
//            timelineService.deleteTimelineWithBookId(id);

//            bookRepository.deleteById(id);
            Book book = bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

            // Tìm kiếm trạng thái với ID là "3"
            Status deletedStatus = statusRepository.findById(3L).orElseThrow(() -> new ResourceNotFoundException("Status not found with id: " + 3));

            // Đặt trạng thái của sách thành "3"
            book.setStatus(deletedStatus);

            // Lưu lại sách
            bookRepository.save(book);

        } else {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
    }

    @Transactional
    public List<Book> searchBooksByName(String name) {
        return bookRepository.findByBookNameContainingIgnoreCase(name);
    }

    @Transactional
    public List<Book> searchBooksByCategoryId(Long categoryId) {
        return bookRepository.findByCategory_CategoryID(categoryId);
    }

    @Transactional
    public List<Book> searchBooksByAuthor(String author) {
        return bookRepository.findByBookAuthorContaining(author);
    }

//THANG
public void updateBookStars(Long bookID, Long userID, Integer stars) {
    Book book = bookRepository.findById(bookID).orElseThrow(() -> new IllegalArgumentException("Invalid book ID"));


    // Kiểm tra xem người dùng đã bỏ phiếu chưa
    if (book.getVoters().containsKey(userID)) {
        throw new IllegalArgumentException("User has already voted for this book");
    }


    // Thêm người dùng và số sao vào voters
    book.getVoters().put(userID, stars);


    // Cập nhật tổng số sao
    Integer totalStars = book.getBookStar();
    if (totalStars == null) {
        totalStars = 0;
    }
    book.setBookStar(totalStars + stars);


    bookRepository.save(book);
}
}

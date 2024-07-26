package com.example.demo.book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByBookNameContainingIgnoreCase(String bookName);
    List<Book> findByBookAuthorContaining(String author);
    List<Book> findByCategory_CategoryID(Long categoryID);  // Updated query method
    @Query("SELECT b FROM Book b WHERE b.bookStar = (SELECT MAX(b2.bookStar) FROM Book b2 WHERE b2.status.statusID = 1) AND b.status.statusID = 1")
    List<Book> findTopByBookStarAndStatus(); //most voted book status id = 1
}

package com.example.demo.book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByBookNameContainingIgnoreCase(String bookName);
    List<Book> findByBookAuthorContaining(String author);
    List<Book> findByCategory_CategoryID(Long categoryID);  // Updated query method
}

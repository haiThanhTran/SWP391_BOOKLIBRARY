package com.example.demo.comment;

import com.example.demo.book.Book;
import com.example.demo.user.User;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Transactional
    public List<Comment> getCommentsByBookId(Long bookId) {
        List<Comment> comments = commentRepository.findByBook_BookID(bookId);
        for (Comment comment : comments) {
            Hibernate.initialize(comment.getBook());  // Initialize the book associated with each comment
            if (comment.getBook() != null && comment.getBook().getCategory() != null) {
                Hibernate.initialize(comment.getBook().getCategory().getBooks());  // Further initialize category if needed
            }
        }
        return comments;
    }

    public Comment saveComment(Comment comment, User user, Book book, String text) {
        comment.setText(text);
        comment.setUser(user);
        comment.setBook(book);
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}

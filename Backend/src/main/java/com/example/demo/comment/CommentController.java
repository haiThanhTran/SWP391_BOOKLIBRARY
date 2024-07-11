package com.example.demo.comment;

import com.example.demo.book.Book;
import com.example.demo.book.BookRepository;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books/{bookId}/comments")
public class CommentController {

    private final UserService userService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long bookId) {
        List<Comment> comments = commentService.getCommentsByBookId(bookId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long bookId, @RequestBody Comment comment) {
        // Kiểm tra và lấy thông tin sách
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

        // Kiểm tra và lấy thông tin người dùng
        if (comment.getUserId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        User user = userService.findById(comment.getUserId());
        if (user == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Thiết lập thông tin người dùng và sách trong bình luận
        comment.setUser(user);
        comment.setBook(book);

        // Lưu bình luận
        Comment savedComment = commentService.saveComment(comment, user, book, comment.getText());
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }
}

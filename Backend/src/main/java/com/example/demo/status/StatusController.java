package com.example.demo.status;

import com.example.demo.book.Book;
import com.example.demo.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/status")
public class StatusController {
    private final StatusService statusService;

    @GetMapping
    public ResponseEntity<List<Status>> getAllBooks() {
        List<Status> status = statusService.getAllStatus();
        return ResponseEntity.ok(status);
    }
}

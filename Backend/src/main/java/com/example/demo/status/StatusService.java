package com.example.demo.status;

import com.example.demo.book.Book;
import com.example.demo.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatusService {
    private final StatusRepository statusRepository;

    public List<Status> getAllStatus() {
        List<Status> status = statusRepository.findAll();
        return status;
    }
}

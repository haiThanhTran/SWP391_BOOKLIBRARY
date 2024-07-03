package com.example.demo.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/publishers")
public class PublisherController {
    private final PublisherService publisherService;

    @GetMapping
    public ResponseEntity<List<Publisher>> getAllpublishers() {
        List<Publisher> publishers = publisherService.getAllpublishers();
        return ResponseEntity.ok(publishers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publisher> getPublisherById(@PathVariable Long id) {
        Publisher publisher = publisherService.getpublisherById(id);
        return ResponseEntity.ok(publisher);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Publisher> createpublisher(@RequestBody Publisher publisher) {
        Publisher createdpublisher = publisherService.createpublisher(publisher);
        return ResponseEntity.ok(createdpublisher);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Publisher> updatepublisher(@PathVariable Long id, @RequestBody Publisher publisher) {
        Publisher updatedpublisher = publisherService.updatepublisher(id, publisher);
        return ResponseEntity.ok(updatedpublisher);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletepublisher(@PathVariable Long id) {
        publisherService.deletepublisher(id);
        return ResponseEntity.noContent().build();
    }


}

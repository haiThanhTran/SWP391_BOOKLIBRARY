package com.example.demo.publisher;

import com.example.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService {
    private final PublisherRepository publisherRepository;

    public List<Publisher> getAllpublishers() {
        List<Publisher> publishers = publisherRepository.findAll();
        return publishers;
    }

    public Publisher getpublisherById(Long id) {
        return publisherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("publisher not found with id: " + id));
    }

    @Transactional
    public Publisher createpublisher(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    @Transactional
    public Publisher updatepublisher(Long id, Publisher updatedPublisher) {
        return publisherRepository.findById(id)
                .map(publisher -> {
                    publisher.setPublisherName(updatedPublisher.getPublisherName());
                    return publisherRepository.save(publisher);
                })
                .orElseThrow(() -> new ResourceNotFoundException("publisher not found with id: " + id));
    }

    @Transactional
    public void deletepublisher(Long id) {
        if (publisherRepository.existsById(id)) {
            publisherRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("publisher not found with id: " + id);
        }
    }
}

package com.example.demo.importBook;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImportBookService {
    private final ImportBookRepository importBookRepository;

    @Autowired
    public ImportBookService(ImportBookRepository importBookRepository) {
        this.importBookRepository = importBookRepository;
    }

    @Transactional
    public ImportBook createImportBook(ImportBook importBook) {
        return importBookRepository.save(importBook);
    }

    // Phương thức để tính tổng chi phí nhập sách từ một danh sách ImportBook
    @Transactional
    public double calculateTotalExpense(List<ImportBook> importBooks) {
        double totalExpense = 0;
        for (ImportBook importBook : importBooks) {
            totalExpense += importBook.getImportQuantity() * importBook.getBook().getBookPrice();
        }
        return totalExpense;
    }
}


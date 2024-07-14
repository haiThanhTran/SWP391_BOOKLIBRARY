package com.example.demo.importBook;

import com.example.demo.book.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/importBooks")
public class ImportBookController {

    private final ImportBookRepository importBookRepository;
    private final BookRepository bookRepository;
    private final ImportBookService importBookService;

    @Autowired
    public ImportBookController(ImportBookRepository importBookRepository, BookRepository bookRepository, ImportBookService importBookService) {
        this.importBookRepository = importBookRepository;
        this.bookRepository = bookRepository;
        this.importBookService = importBookService;
    }

    @GetMapping("/monthlyExpense")
    public ResponseEntity<Double> getMonthlyImportExpense() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);

        // Convert LocalDateTime to java.util.Date
        Date startDate = java.sql.Timestamp.valueOf(startOfMonth);
        Date endDate = java.sql.Timestamp.valueOf(endOfMonth);

        // Find all import books within the current month
        List<ImportBook> importBooks = importBookRepository.findAllByImportDateBetween(startDate, endDate);

        // Calculate total expense using service method
        double totalExpense = importBookService.calculateTotalExpense(importBooks);

        return ResponseEntity.ok(totalExpense);
    }

    @GetMapping("/percentageChange")
    public ResponseEntity<Map<String, Double>> getPercentageChange() {
        // Lấy ngày đầu và cuối của tháng hiện tại
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);

        // Chuyển đổi LocalDateTime sang java.util.Date
        Date currentStartDate = java.sql.Timestamp.valueOf(startOfMonth);
        Date currentEndDate = java.sql.Timestamp.valueOf(endOfMonth);

        // Lấy ngày đầu và cuối của tháng trước
        LocalDateTime previousMonthStart = LocalDate.now().minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime previousMonthEnd = LocalDate.now().minusMonths(1).withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth()).atTime(23, 59, 59);

        // Chuyển đổi LocalDateTime sang java.util.Date
        Date previousStartDate = java.sql.Timestamp.valueOf(previousMonthStart);
        Date previousEndDate = java.sql.Timestamp.valueOf(previousMonthEnd);

        // Tính tổng chi phí nhập sách trong tháng hiện tại
        List<ImportBook> currentMonthImportBooks = importBookRepository.findAllByImportDateBetween(currentStartDate, currentEndDate);
        double currentMonthTotalExpense = importBookService.calculateTotalExpense(currentMonthImportBooks);

        // Tính tổng chi phí nhập sách trong tháng trước
        List<ImportBook> previousMonthImportBooks = importBookRepository.findAllByImportDateBetween(previousStartDate, previousEndDate);
        double previousMonthTotalExpense = importBookService.calculateTotalExpense(previousMonthImportBooks);

        // Tính phần trăm thay đổi
        double percentageChange = 0.0;
        if (previousMonthTotalExpense != 0) {
            percentageChange = ((currentMonthTotalExpense - previousMonthTotalExpense) / previousMonthTotalExpense) * 100;
        }

        Map<String, Double> result = new HashMap<>();
        result.put("percentageChange", percentageChange);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/importBooksInfo")
    public ResponseEntity<List<Map<String, Object>>> getImportBooksInfo() {
        List<ImportBook> importBooks = importBookRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        for (ImportBook importBook : importBooks) {
            Map<String, Object> bookInfo = new HashMap<>();
            bookInfo.put("import_id", importBook.getImportID());
            bookInfo.put("import_date", importBook.getImportDate());
            bookInfo.put("import_quantity", importBook.getImportQuantity());
            bookInfo.put("book_id", importBook.getBook().getBookID());
            bookInfo.put("book_name", importBook.getBook().getBookName());
            bookInfo.put("book_image", importBook.getBook().getBookImage());
            bookInfo.put("import_money", importBook.getImportQuantity() * importBook.getBook().getBookPrice()); // Calculate import money
            result.add(bookInfo);
        }

        return ResponseEntity.ok(result);
    }

}

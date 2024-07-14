package com.example.demo.orderDetail;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderDetailID(Long orderDetailID);
    List<OrderDetail> findBySearchID(String searchID);

    long countByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    //order
    @Query("SELECT COUNT(DISTINCT o.searchID) FROM OrderDetail o WHERE o.orderDate BETWEEN :startOfMonth AND :endOfMonth")
    long countDistinctBySearchIDForCurrentMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    //borrower
    @Query("SELECT COUNT(DISTINCT o.user.id) FROM OrderDetail o WHERE o.orderDate BETWEEN :startOfMonth AND :endOfMonth")
    long countDistinctUserIdByOrderDateBetween(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    //viewAllOrders
    @Query("SELECT o.searchID, SUM(o.quantity), SUM(o.totalPrice), u.id, u.avatar " +
            "FROM OrderDetail o JOIN o.user u " +
            "WHERE o.orderDate BETWEEN :startOfMonth AND :endOfMonth " +
            "GROUP BY o.searchID, u.id, u.avatar")
    List<Object[]> findAggregatedOrderDetailsByMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    //viewBorrower
    @Query("SELECT u.id, u.avatar, COUNT(DISTINCT o.searchID) as searchCount " +
            "FROM OrderDetail o JOIN o.user u " +
            "GROUP BY u.id, u.avatar " +
            "ORDER BY searchCount DESC")
    List<Object[]> findUsersWithSearchCount();

    //top 5 books most borrowed
    @Query(value = "SELECT b.book_id, b.book_name, b.book_image, b.book_quantity, COUNT(o.book_id) AS total_borrowed " +
            "FROM OrderDetail o " +
            "JOIN Book b ON o.book_id = b.book_id " +
            "GROUP BY o.book_id, b.book_name " + // Đã thêm khoảng trắng sau GROUP BY
            "ORDER BY total_borrowed DESC " +
            "LIMIT 5", nativeQuery = true)
    List<Object[]> findTop5MostBorrowedBooks();

}

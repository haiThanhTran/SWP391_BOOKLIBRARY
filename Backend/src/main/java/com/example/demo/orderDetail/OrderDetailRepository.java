package com.example.demo.orderDetail;


import com.example.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByUser(User user);
    List<OrderDetail> findBySearchID(String searchID);
    List<OrderDetail> findByStatus(String status); // Thêm phương thức tìm kiếm theo trạng thái
    List<OrderDetail> findByOrderDetailID(Long orderDetailID);

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

    //get compensated money in current month
    @Query("SELECT o FROM OrderDetail o WHERE o.status = :status AND o.orderDate BETWEEN :startOfMonth AND :endOfMonth")
    List<OrderDetail> findByStatusAndOrderDateBetween(
            @Param("status") String status,
            @Param("startOfMonth") LocalDateTime startOfMonth,
            @Param("endOfMonth") LocalDateTime endOfMonth
    );
    //All compensated
    @Query("SELECT o.searchID, o.status, o.totalPrice * CASE WHEN o.status = 'Compensated by Money' THEN 3 ELSE 0 END AS adjustedPrice, b.bookImage, u.avatar, u.userName " +
            "FROM OrderDetail o " +
            "JOIN o.book b " +
            "JOIN o.user u " +
            "WHERE o.status IN ('Compensated by Money', 'Compensated by Book')")
    List<Object[]> findCompensatedOrderDetails();

}

package com.example.demo.orderDetail;


import com.example.demo.user.User;
import com.example.demo.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByUser(User user);
    List<OrderDetail> findBySearchID(String searchID);
    List<OrderDetail> findByStatus(String status); // Thêm phương thức tìm kiếm theo trạng thái
    List<OrderDetail> findByOrderDetailID(Long orderDetailID);

    List<OrderDetail> findBySearchID(String searchID);
    List<OrderDetail> findBySearchID(Long userID);
}

package com.example.demo.orderDetail;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderDetailID(Long orderDetailID);
    List<OrderDetail> findBySearchID(String searchID);
}

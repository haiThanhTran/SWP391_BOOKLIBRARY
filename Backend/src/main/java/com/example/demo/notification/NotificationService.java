package com.example.demo.notification;

import com.example.demo.orderDetail.OrderDetail;
import com.example.demo.orderDetail.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getAllNotifications() {
        return orderDetailRepository.findAll();
    }
}

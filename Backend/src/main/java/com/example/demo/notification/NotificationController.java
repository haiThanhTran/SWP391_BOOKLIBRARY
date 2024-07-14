package com.example.demo.notification;

import com.example.demo.orderDetail.OrderDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/api/notifications")
    public List<OrderDetail> getNotifications() {
        return notificationService.getAllNotifications();
    }
}

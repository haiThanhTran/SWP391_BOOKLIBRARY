package com.example.demo.orderDetail;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class OrderDetailService {


    @Autowired
    private OrderDetailRepository bookOrderRepository;


    public List<OrderDetail> getOrdersByOrderID(Long orderID) {
        return bookOrderRepository.findByOrderDetailID(orderID);
    }


    public List<OrderDetail> getOrdersBySearchID(String searchID) {
        return bookOrderRepository.findBySearchID(searchID);
    }


    public List<OrderDetail> createBookOrders(List<OrderDetail> bookOrders) {
        return bookOrderRepository.saveAll(bookOrders);
    }


    public OrderDetail updateReturnDate(Long orderID, LocalDateTime returnDate) {
        Optional<OrderDetail> bookOrder = bookOrderRepository.findById(orderID);
        if (bookOrder.isPresent()) {
            OrderDetail order = bookOrder.get();
            order.setReturnDate(returnDate);
            order.setStatus("Returned");
            return bookOrderRepository.save(order);
        }
        return null;
    }


    public OrderDetail updateOrder(Long orderID, String status, LocalDateTime returnDate) {
        Optional<OrderDetail> bookOrder = bookOrderRepository.findById(orderID);
        if (bookOrder.isPresent()) {
            OrderDetail order = bookOrder.get();
            order.setStatus(status);
            order.setReturnDate(returnDate);
            return bookOrderRepository.save(order);
        }
        return null;
    }


}

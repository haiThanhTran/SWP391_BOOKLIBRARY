package com.example.demo.orderDetail;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.YearMonth;
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

    //DASHBOARD
    public long getDistinctOrdersCountByMonth(YearMonth yearMonth) {
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return bookOrderRepository.countDistinctBySearchIDForCurrentMonth(startOfMonth, endOfMonth);
    }

    public long getOrdersCountByMonth(YearMonth yearMonth) {
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return bookOrderRepository.countByOrderDateBetween(startOfMonth, endOfMonth);
    }

    // Get the count of unique users who borrowed books in a given month
    public long countUniqueUsersByMonth(YearMonth yearMonth) {
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return bookOrderRepository.countDistinctUserIdByOrderDateBetween(startOfMonth, endOfMonth);
    }

    public List<Object[]> getAggregatedOrderDetailsByMonth(YearMonth yearMonth) {
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        return bookOrderRepository.findAggregatedOrderDetailsByMonth(startOfMonth, endOfMonth);
    }

    public List<Object[]> getUsersWithSearchCount() {
        return bookOrderRepository.findUsersWithSearchCount();
    }

    public List<Object[]> getTop5MostBorrowedBooks() {
        return bookOrderRepository.findTop5MostBorrowedBooks();
    }
}

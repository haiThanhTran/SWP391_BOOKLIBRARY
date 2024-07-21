package com.example.demo.orderDetail;

import com.example.demo.book.Book;
import com.example.demo.book.BookService;
import com.example.demo.user.User;
import com.example.demo.user.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service // Đánh dấu lớp này là một service trong Spring
public class OrderDetailService {
    private static final Logger logger = LoggerFactory.getLogger(OrderDetailService.class); // Khởi tạo logger để ghi log

    @Autowired // Tự động tiêm phụ thuộc OrderDetailRepository
    private OrderDetailRepository bookOrderRepository;


    @Autowired // Tự động tiêm phụ thuộc UserService
    private UserService userService;

    @Autowired // Tự động tiêm phụ thuộc BookService
    private BookService bookService;

    @PersistenceContext // Tạo EntityManager để thao tác với các thực thể trong cơ sở dữ liệu
    private EntityManager entityManager;

    // Lấy danh sách đơn hàng theo userID
    public List<OrderDetail> getOrdersByUserId(Long userID) {
        User user = userService.findById(userID); // Tìm user theo ID
        return bookOrderRepository.findByUser(user); // Tìm các đơn hàng của user đó
    }

    // Lấy danh sách đơn hàng theo searchID
    public List<OrderDetail> getOrdersBySearchID(String searchID) {
        return bookOrderRepository.findBySearchID(searchID); // Tìm các đơn hàng theo searchID
    }

    // Tạo các đơn hàng sách
    public List<OrderDetail> createBookOrders(List<OrderDetail> bookOrders) {
        return bookOrderRepository.saveAll(bookOrders); // Lưu tất cả các đơn hàng vào cơ sở dữ liệu
    }

    public OrderDetail updateOrder(Long orderID, String status, LocalDateTime returnDate) {
        Optional<OrderDetail> bookOrder = bookOrderRepository.findById(orderID);
        if (bookOrder.isPresent()) {
            OrderDetail order = bookOrder.get();
            logger.info("Updating order ID {}: status={}, returnDate={}", orderID, status, returnDate);

            switch (status) {
                case "Borrowed":
                    order.setStatus("Borrowed");
                    order.setReturnDate(returnDate);
                    Book borrowedBook = order.getBook();
                    borrowedBook.setBookQuantity(borrowedBook.getBookQuantity() - order.getQuantity());
                    bookService.updateBook(borrowedBook.getBookID(), borrowedBook);
                    break;
                case "Returned":
                    order.setStatus("Returned");
                    order.setReturnDate(returnDate);
                    Book returnedBook = order.getBook();
                    returnedBook.setBookQuantity(returnedBook.getBookQuantity() + order.getQuantity());
                    bookService.updateBook(returnedBook.getBookID(), returnedBook);
                    break;
                case "Compensated by Book":
                    order.setStatus("Compensated by Book");
                    Book compensatedBook = order.getBook();
                    compensatedBook.setBookQuantity(compensatedBook.getBookQuantity() + order.getQuantity());
                    bookService.updateBook(compensatedBook.getBookID(), compensatedBook);
                    break;
                case "Compensated by Money":
                    order.setStatus("Compensated by Money");
                    break;
                default:
                    order.setStatus(status);
                    break;
            }
            order.setReturnDate(returnDate);
            bookOrderRepository.save(order);
            return order;
        }
        logger.warn("Order ID {} not found for update", orderID);
        return null;
    }
    public Optional<OrderDetail> findById(Long orderID) {
        return bookOrderRepository.findById(orderID);
    }

    @Transactional
    public void cancelOrder(OrderDetail order) {
        order.setStatus("Cancelled");

        Book book = order.getBook();
        book.setBookQuantity(book.getBookQuantity() + order.getQuantity());
        bookService.updateBook(book.getBookID(), book);

        bookOrderRepository.save(order);
    }

    @Scheduled(fixedRate = 1000) // Phương thức này sẽ được thực thi mỗi giây một lần
    @Transactional // Đánh dấu phương thức này để được thực thi trong một giao dịch
    public void cancelExpiredOrders() {
        LocalDateTime now = LocalDateTime.now(); // Lấy thời gian hiện tại


        List<OrderDetail> pendingOrders = bookOrderRepository.findByStatus("Pending"); // Lấy tất cả các đơn hàng có trạng thái "Pending"

        for (OrderDetail order : pendingOrders) { // Duyệt qua từng đơn hàng đang chờ xử lý
            LocalDateTime orderDate = order.getOrderDate(); // Lấy ngày đặt hàng của đơn hàng hiện tại


            if (orderDate.plusDays(1).isBefore(now)) { // Kiểm tra nếu ngày đặt hàng cộng thêm một ngày trước thời gian hiện tại


                order.setStatus("Cancelled"); // Đặt trạng thái của đơn hàng thành "Cancelled"

                // Cộng lại số lượng sách vào kho
                Book book = order.getBook(); // Lấy sách liên quan
                entityManager.refresh(book); // Tải đầy đủ đối tượng Book trong phiên giao dịch hiện tại
                book.setBookQuantity(book.getBookQuantity() + order.getQuantity()); // Cộng lại số lượng sách vào kho
                bookService.updateBook(book.getBookID(), book); // Cập nhật sách trong cơ sở dữ liệu

                bookOrderRepository.save(order); // Lưu đơn hàng đã cập nhật vào repository

            }
        }

        List<OrderDetail> borrowedOrders = bookOrderRepository.findByStatus("Borrowed"); // Lấy tất cả các đơn hàng có trạng thái "Borrowed"


        for (OrderDetail order : borrowedOrders) { // Duyệt qua từng đơn hàng đang được mượn
            LocalDateTime returnDate = order.getReturnDate(); // Lấy ngày trả sách của đơn hàng hiện tại


            if (returnDate.isBefore(now)) { // Kiểm tra nếu ngày trả sách trước thời gian hiện tại


                order.setStatus("Overdue"); // Đặt trạng thái của đơn hàng thành "Overdue"
                bookOrderRepository.save(order); // Lưu đơn hàng đã cập nhật vào repository

            }
        }
    }
        //DASHBOARD
        public long getDistinctOrdersCountByMonth (YearMonth yearMonth){
            LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            return bookOrderRepository.countDistinctBySearchIDForCurrentMonth(startOfMonth, endOfMonth);
        }

        public long getOrdersCountByMonth (YearMonth yearMonth){
            LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            return bookOrderRepository.countByOrderDateBetween(startOfMonth, endOfMonth);
        }

        // Get the count of unique users who borrowed books in a given month
        public long countUniqueUsersByMonth (YearMonth yearMonth){
            LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            return bookOrderRepository.countDistinctUserIdByOrderDateBetween(startOfMonth, endOfMonth);
        }

        public List<Object[]> getAggregatedOrderDetailsByMonth (YearMonth yearMonth){
            LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            return bookOrderRepository.findAggregatedOrderDetailsByMonth(startOfMonth, endOfMonth);
        }

        public List<Object[]> getUsersWithSearchCount () {
            return bookOrderRepository.findUsersWithSearchCount();
        }

        public List<Object[]> getTop5MostBorrowedBooks () {
            return bookOrderRepository.findTop5MostBorrowedBooks();
        }

}
package com.example.demo.orderDetail;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.demo.user.UserService;
import com.example.demo.user.User;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderDetailController {
    private static final Logger logger = LoggerFactory.getLogger(OrderDetailController.class);


    @Autowired
    private OrderDetailService bookOrderService;


    @Autowired
    private UserService userService;


    @GetMapping("/{orderID}")
    public ResponseEntity<List<OrderDetail>> getOrdersByOrderID(@PathVariable Long orderID) {
        System.out.println(orderID);
        List<OrderDetail> orders = bookOrderService.getOrdersByOrderID(orderID);
        System.out.println(orders);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orders);
    }


    @GetMapping("/search/{searchID}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<OrderDetailDTO>> getOrdersBySearchID(@PathVariable String searchID) {
        logger.info("Received search request for search ID: {}", searchID);
        try {
            List<OrderDetail> orders = bookOrderService.getOrdersBySearchID(searchID);
            List<OrderDetailDTO> dtoList = orders.stream().map(order -> new OrderDetailDTO(
                    order.getOrderDetailID(),
                    order.getBook().getBookID(),
                    order.getBook().getBookName(),
                    order.getBook().getBookImage(), // Ánh xạ trường ảnh sách
                    order.getTotalPrice(),
                    order.getQuantity(),
                    order.getOrderDate(),
                    order.getReturnDate(),
                    order.getStatus(),
                    (order.getUser() != null) ? order.getUser().getUserName() : null,
                    (order.getUser() != null) ? order.getUser().getUserMail() : null
            )).collect(Collectors.toList());


            if (dtoList.isEmpty()) {
                logger.warn("No orders found for search ID: {}", searchID);
                return ResponseEntity.notFound().build();
            }
            logger.info("Returning orders: {}", dtoList);
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            logger.error("Error while processing search request for search ID: {}", searchID, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




    private static final int LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();


    public static String generateUniqueNumber() {
        Set<Integer> numbers = new HashSet<>();
        while (numbers.size() < LENGTH) {
            numbers.add(RANDOM.nextInt(10));
        }
        StringBuilder sb = new StringBuilder(LENGTH);
        for (Integer number : numbers) {
            sb.append(number);
        }
        return sb.toString();
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> createBookOrders(@RequestBody List<OrderDetail> bookOrders) {
        String searchID = generateUniqueNumber(); // Sử dụng mã ngẫu nhiên ngắn hơn
        for (OrderDetail order : bookOrders) {
            if (order.getUserID() != null) {
                User user = userService.findById(order.getUserID()); // Tìm User theo ID chỉ khi UserID không phải là null
                if (user == null) {
                    return ResponseEntity.badRequest().body(Map.of("error", "User not found for the given userID"));
                }
                order.setUser(user); // Thiết lập đối tượng User
            } else {
                // Xử lý khi không có User: bạn có thể bỏ qua, hoặc thông báo lỗi
                return ResponseEntity.badRequest().body(Map.of("error", "User information is missing for order"));
            }
            order.setSearchID(searchID);
            System.out.println(order); // In thông tin nhận được để debug
        }
        List<OrderDetail> createdOrders = bookOrderService.createBookOrders(bookOrders);
        Map<String, Object> response = new HashMap<>();
        response.put("orderID", createdOrders.get(0).getOrderDetailID());
        response.put("searchID", searchID);
        return ResponseEntity.ok(response);
    }






    @PutMapping("/{orderID}/return")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<OrderDetail> updateReturnDate(@PathVariable Long orderID, @RequestBody Map<String, Object> payload) {
        try {
            String status = (String) payload.get("status");
            LocalDateTime returnDate = LocalDateTime.parse((String) payload.get("returnDate"));
            OrderDetail updatedOrder = bookOrderService.updateOrder(orderID, status, returnDate);
            if (updatedOrder == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    //DASHBOARD


    // API trả về số lượng order của tháng hiện tại
    @GetMapping("/currentMonthOrderCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getCurrentMonthOrderCount() {
        try {
            YearMonth currentMonth = YearMonth.now();
            long currentMonthCount = bookOrderService.getDistinctOrdersCountByMonth(currentMonth);
            return ResponseEntity.ok(currentMonthCount);
        } catch (Exception e) {
            // Replace logger.error with the appropriate logger usage
            System.err.println("Error while fetching current month order count: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // API trả về phần trăm thay đổi số lượng order giữa tháng hiện tại và tháng trước đó
    @GetMapping("/currentMonthPercentageChange")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCurrentMonthPercentageChange() {
        try {
            YearMonth currentMonth = YearMonth.now();
            YearMonth previousMonth = currentMonth.minusMonths(1);

            long currentMonthCount = bookOrderService.getOrdersCountByMonth(currentMonth);
            long previousMonthCount = bookOrderService.getOrdersCountByMonth(previousMonth);

            double percentageChange = 0;
            if (previousMonthCount != 0) {
                percentageChange = ((double) (currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
            } else if (currentMonthCount != 0) {
                percentageChange = 100;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("currentMonthCount", currentMonthCount);
            response.put("previousMonthCount", previousMonthCount);
            response.put("percentageChange", percentageChange);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error while calculating percentage change", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/uniqueBorrowersCount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getUniqueBorrowersCountForCurrentMonth() {
        YearMonth currentMonth = YearMonth.now();
        long count = bookOrderService.countUniqueUsersByMonth(currentMonth);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/uniqueBorrowersPercentageChange")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUniqueBorrowersPercentageChange() {
        YearMonth currentMonth = YearMonth.now();
        YearMonth previousMonth = currentMonth.minusMonths(1);

        long currentMonthCount = bookOrderService.countUniqueUsersByMonth(currentMonth);
        long previousMonthCount = bookOrderService.countUniqueUsersByMonth(previousMonth);

        double percentageChange = 0;
        if (previousMonthCount != 0) {
            percentageChange = ((double) (currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        } else if (currentMonthCount != 0) {
            percentageChange = 100;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("currentMonthCount", currentMonthCount);
        response.put("previousMonthCount", previousMonthCount);
        response.put("percentageChange", percentageChange);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboardOrders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object[]>> getCurrentMonthAggregatedOrders() {
        try {
            YearMonth currentMonth = YearMonth.now();
            List<Object[]> aggregatedOrders = bookOrderService.getAggregatedOrderDetailsByMonth(currentMonth);
            return ResponseEntity.ok(aggregatedOrders);
        } catch (Exception e) {
            // Replace logger.error with the appropriate logger usage
            System.err.println("Error while fetching current month aggregated orders: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/usersWithSearchCount")
    public ResponseEntity<List<Map<String, Object>>> getUsersWithSearchCount() {
        List<Object[]> results = bookOrderService.getUsersWithSearchCount();
        List<Map<String, Object>> response = results.stream().map(result -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("userId", result[0]);
            userMap.put("avatar", result[1]);
            userMap.put("searchCount", result[2]);
            return userMap;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-5-borrowed-books")
    public ResponseEntity<List<Object[]>> getTop5MostBorrowedBooks() {
        List<Object[]> results = bookOrderService.getTop5MostBorrowedBooks();
        return ResponseEntity.ok(results);
    }


    //Borrow chart
    @GetMapping("/monthlyBorrowings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Long>> getMonthlyBorrowings() {
        try {
            // Lấy năm hiện tại
            Year currentYear = Year.now();

            // Lấy số lượt mượn sách hàng tháng cho năm hiện tại
            List<Long> monthlyBorrowings = new ArrayList<>();
            for (int month = 1; month <= 12; month++) {
                YearMonth yearMonth = YearMonth.of(currentYear.getValue(), month);
                long borrowingsCount = bookOrderService.getOrdersCountByMonth(yearMonth);
                monthlyBorrowings.add(borrowingsCount);
            }

            return ResponseEntity.ok(monthlyBorrowings);
        } catch (Exception e) {
            logger.error("Error while fetching monthly borrowings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //User chart
    @GetMapping("/monthlyUniqueBorrowers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Long>> getMonthlyUniqueBorrowers() {
        try {
            Year currentYear = Year.now();
            List<Long> monthlyUniqueBorrowers = new ArrayList<>();
            for (int month = 1; month <= 12; month++) {
                YearMonth yearMonth = YearMonth.of(currentYear.getValue(), month);
                long uniqueBorrowersCount = bookOrderService.countUniqueUsersByMonth(yearMonth);
                monthlyUniqueBorrowers.add(uniqueBorrowersCount);
            }
            return ResponseEntity.ok(monthlyUniqueBorrowers);
        } catch (Exception e) {
            logger.error("Error while fetching monthly unique borrowers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

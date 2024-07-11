package com.example.demo.orderDetail;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;


import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    private Long orderDetailID;
    private Long bookID;
    private String bookName;
    private String bookImage; // Thêm trường ảnh sách
    private Double totalPrice;
    private Integer quantity;
    private String searchID;
    private LocalDateTime orderDate;
    private LocalDateTime returnDate;
    private String status;
    private String userName;
    private String userEmail;
}

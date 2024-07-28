package com.example.demo.insertFakeData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserInsertionService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insertUsers() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        int startIndex = 6;
        int numberOfCustomers = 25;
        String emailPrefix = "khachhang";
        String emailDomain = "@gmail.com";

        for (int i = startIndex; i < startIndex + numberOfCustomers; i++) {
            String rawPassword = "12345678";
            String encodedPassword = encoder.encode(rawPassword);  // Mã hóa lại mật khẩu trong mỗi lần lặp

            String email = emailPrefix + i + emailDomain;
            String avatar = "avatar" + i + ".jpg";
            String userName = "khachhang" + i;
            String userAddress = "Address " + i;
            String userPhone = "1234567890";
            int roleId = 1;

            String sql = "INSERT INTO user (avatar, bio, first_login, is_enabled, user_address, user_mail, user_name, user_pass, user_phone, role_id) VALUES (?, ?, 1, 1, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, avatar, null, userAddress, email, userName, encodedPassword, userPhone, roleId);
        }

        System.out.println("Data inserted successfully.");
    }
}

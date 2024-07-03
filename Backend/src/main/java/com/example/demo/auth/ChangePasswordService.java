package com.example.demo.auth;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
@Service
public class ChangePasswordService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    private static final String SECRET_KEY = "your_very_secure_secret_key_that_is_at_least_32_characters_long";

    public void resetPassword(String newPassword, String oldPassword, String token) {
// Decode the JWT token
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token);

        // Get the user email from the token
        String userEmail = jws.getBody().getSubject();

        // Retrieve the user
        User user = userRepository.findByUserMail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!passwordEncoder.matches(oldPassword, user.getUserPass())) {
            throw new RuntimeException("Old password is incorrect");
        }else if (newPassword == oldPassword) {
            throw new RuntimeException("New password cannot be the same as the old password");
        }


        user.setUserPass(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}

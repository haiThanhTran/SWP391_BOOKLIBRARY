package com.example.demo.auth;

import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class JwtTokenProvider {
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private static final String SECRET_KEY = "your_very_secure_secret_key_that_is_at_least_32_characters_long";

    @Autowired
    public void setPasswordEncoder( @Lazy PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public UserClaims getClaimsFromJWT(String token) {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token);

        String userEmail = jws.getBody().getSubject();

        // Retrieve the user
        User user = userRepository.findByUserMail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        //get user role from token
        Claims claims = jws.getBody();

        UserClaims userClaims = new UserClaims();
        userClaims.setRole("ROLE_" + claims.get("role"));
//        userClaims.setRoleId(claims.get("roleId", Long.class));
        userClaims.setUserName(user.getUserName());
        userClaims.setHashedPassword(user.getUserPass());

        return userClaims;
    }

    @Getter
    @Setter
    public static class UserClaims {
        private String role;
        private String userName;
        private String hashedPassword;

        // getters and setters
    }

//    @Getter
//    @Setter
//    public static class UserClaims {
//        private Long roleId;
//        private String userName;
//        private String hashedPassword;
//    }
}
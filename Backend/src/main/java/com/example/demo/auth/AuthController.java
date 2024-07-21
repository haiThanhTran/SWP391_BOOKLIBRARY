package com.example.demo.auth;

import com.example.demo.user.AuthResponse;
import com.example.demo.user.User;
import com.example.demo.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CaptchaService captchaService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Verify CAPTCHA
        boolean captchaVerified = captchaService.verifyCaptcha(loginRequest.getCaptchaToken());
        if (!captchaVerified) {
            return ResponseEntity.status(400).body("Captcha verification failed");
        }

        Optional<User> userOptional = userRepository.findByUserMail(loginRequest.getUser_name());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Email not found");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(loginRequest.getUser_pass(), user.getUserPass())) {
            return ResponseEntity.status(401).body("Invalid password");
        }
        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("User not verified");
        }

        if (user.getRole().getRoleID() == 2 && user.isFirstLogin()) {
            return ResponseEntity.status(403).body("Please reset default password before logging in.");
        }

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        if (username == null || jwtUtil.isTokenExpired(jwt)) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        Optional<User> userOptional = userRepository.findByUserMail(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

        return ResponseEntity.ok(userOptional.get());
    }

    static class LoginRequest {
        private String user_name;
        private String user_pass;
        private String captchaToken;

        public String getUser_name() {
            return user_name;
        }

        public void setUser_name(String user_name) {
            this.user_name = user_name;
        }

        public String getUser_pass() {
            return user_pass;
        }

        public void setUser_pass(String user_pass) {
            this.user_pass = user_pass;
        }

        public String getCaptchaToken() {
            return captchaToken;
        }

        public void setCaptchaToken(String captchaToken) {
            this.captchaToken = captchaToken;
        }
    }
}

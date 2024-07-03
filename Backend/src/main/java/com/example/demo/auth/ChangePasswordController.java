package com.example.demo.auth;

import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class ChangePasswordController {

    @Autowired
    private ChangePasswordService changePasswordService;

    @PostMapping("/change-password")
//    @RolesAllowed("USER")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        try {
            changePasswordService.resetPassword(request.getNewPassword(), request.getOldPassword(), request.getToken());
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

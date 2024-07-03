package com.example.demo.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String userName;
    private String userMail;
    private String userAddress;
    private String userPhone;
    private boolean isEnabled;
    private String bio;
    private String avatar;
    private boolean firstLogin;
    private Long roleID;
    private String role;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.id = user.getId();
        this.userName = user.getUserName();
        this.userMail = user.getUserMail();
        this.userAddress = user.getUserAddress();
        this.userPhone = user.getUserPhone();
        this.isEnabled = user.isEnabled();
        this.bio = user.getBio();
        this.avatar = user.getAvatar();
        this.firstLogin = user.isFirstLogin();
        this.roleID = user.getRole().getRoleID();
        this.role = user.getRole().getRole();
    }
}

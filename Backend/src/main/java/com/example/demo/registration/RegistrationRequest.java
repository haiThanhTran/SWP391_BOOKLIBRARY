package com.example.demo.registration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

//@Getter
//@Setter
public record RegistrationRequest(
        String userAddress,
        String userPhone,
        String userName,
        String userMail,
        String userPass,
//        String role){
//}
        Long role) {
}

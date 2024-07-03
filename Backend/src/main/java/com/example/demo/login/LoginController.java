//package com.example.demo.login;
//
//import com.example.demo.security.UserRegistrationDetails;
//import com.example.demo.user.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//
//    @RestController
//    @RequestMapping("/login")
//    public class LoginController {
//
//        @Autowired
//        private UserRepository userRepository;
//
//        @PostMapping()
//        public ResponseEntity<UserDetails> getUserByEmail(@RequestBody String email) {
//            try {
//                UserDetails userDetails = userRepository.findByUserMail(email)
//                        .map(UserRegistrationDetails::new)
//                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//                return ResponseEntity.ok(userDetails);
//            } catch (UsernameNotFoundException e) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//            }
//        }
//    }
//

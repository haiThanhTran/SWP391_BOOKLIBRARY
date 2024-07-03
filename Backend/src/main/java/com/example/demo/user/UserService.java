package com.example.demo.user;

import com.example.demo.auth.JwtUtil;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UserAlreadyExistsException;
import com.example.demo.registration.RegistrationRequest;
import com.example.demo.registration.token.VerificationToken;
import com.example.demo.registration.token.VerificationTokenRepository;
import com.example.demo.role.Role;
import com.example.demo.role.RoleRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final RoleRepository roleRepository;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUserName(updatedUser.getUserName());
            user.setUserMail(updatedUser.getUserMail());
            user.setEnabled(updatedUser.isEnabled());

            // Update Role
            Role newRole = updatedUser.getRole();
            if (newRole != null) {
                Optional<Role> optionalRole = roleRepository.findById(newRole.getRoleID());
                if (optionalRole.isPresent()) {
                    Role role = optionalRole.get();
                    role.setRole(newRole.getRole());
                    user.setRole(role);
                } else {
                    throw new IllegalArgumentException("Role not found with id: " + newRole.getRoleID());
                }
            } else {
                user.setRole(null);
            }

            return userRepository.save(user);
        } else {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }
    }


    @Transactional
    public User updateUserProfile(Long id, User updatedUser) {

        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUserName(updatedUser.getUserName());
            user.setUserAddress(updatedUser.getUserAddress());
            user.setUserPhone(updatedUser.getUserPhone());
            user.setBio(updatedUser.getBio());
            user.setAvatar(updatedUser.getAvatar());
            return userRepository.save(user);
        } else {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }
    }


    @Transactional
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            // Delete the verification token first
            tokenRepository.findByUser(userRepository.findById(id).get()).ifPresent(tokenRepository::delete);
            // Then delete the user
            userRepository.deleteById(id);
        } else {
            throw new UsernameNotFoundException("User not found with id: " + id);
        }
    }


    @Override
    @Transactional
    public User registerUser(RegistrationRequest request) {
        Optional<User> user = this.findByUserMail(request.userMail());
        if (user.isPresent()) {
            throw new UserAlreadyExistsException(
                    "User with email " + request.userMail() + " already exists");
        }
        var newUser = new User();
        newUser.setUserName(request.userName());
        newUser.setUserMail(request.userMail());
        newUser.setUserPass(passwordEncoder.encode(request.userPass()));
        newUser.setUserAddress(request.userAddress());
        newUser.setUserPhone(request.userPhone());

        Role customerRole;
        //create account STAFF
        if (request.role() != null) {
            Long roleId = Long.valueOf(request.role());
            customerRole = roleRepository.findById(roleId)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found with id: 1"));
        }else {
            //create account CUSTOMER
            // Tìm role với ID = 1 (CUSTOMER)
            customerRole = roleRepository.findById(1L)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found with id: 1"));

        }
        newUser.setRole(customerRole);


        return userRepository.save(newUser);
    }


    @Override
    public Optional<User> findByUserMail(String email) {
        return userRepository.findByUserMail(email);
    }

    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @Override
    public void saveUserVerificationToken(User theUser, String token) {
        var verificationToken = new VerificationToken(token, theUser);
        tokenRepository.save(verificationToken);
    }

    @Override
    public String validateToken(String theToken) {
        VerificationToken token = tokenRepository.findByToken(theToken);
        if (token == null) {
            return "Invalid verification token";
        }
        User user = token.getUser();
        Calendar calendar = Calendar.getInstance();
        if ((token.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0) {
            return "Verification link already expired," +
                    " Please, click the link below to receive a new verification link";
        }
        user.setEnabled(true);
        userRepository.save(user);
        return "valid";
    }

    @Override
    public VerificationToken generateNewVerificationToken(String oldToken) {
        VerificationToken verificationToken = tokenRepository.findByToken(oldToken);
        var tokenExpirationTime = new VerificationToken();
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setExpirationTime(tokenExpirationTime.getTokenExpirationTime());
        return tokenRepository.save(verificationToken);
    }
}

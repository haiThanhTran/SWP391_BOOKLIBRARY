package com.example.demo.user;

import com.example.demo.orderDetail.OrderDetail;
import com.example.demo.role.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userName;
    @NaturalId(mutable = true)
    private String userMail;
    private String userPass;
    private String userAddress;
    private String userPhone;
    //    private String role;
    private boolean isEnabled = false;
    private String bio;
    private String avatar;
    private boolean firstLogin = true;

    //    @ManyToOne
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
//    @JsonIgnore
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-order")
    private List<OrderDetail> bookOrders;


}

package com.homeschool.seungcheol.entity;

import com.homeschool.seungcheol.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String username; // 사용자 이름

    private String password; // 사용자 비밀번호

    private String email; // 사용자 이메일

    @Enumerated(EnumType.STRING)
    private Role role;
}

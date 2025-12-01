package com.homeschool.seungcheol.security;

import com.homeschool.seungcheol.enums.Role;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L; // 직렬화 버전 UID

    private final Long userId; // 사용자 고유 ID
    private final String username; // 사용자 이름
    private final String password; // 사용자 비밀번호
    private final Role role; // 사용자 설정 권한 (교수, 학생)1`
    private final String email; // 사용자 이메일

    // 사용자의 권한 목록
    private final Collection<? extends GrantedAuthority> authorities;

    // 사용자의 권한 정보 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    // 사용자의 비밀번호 반환
    @Override
    public @Nullable String getPassword() {
        return password;
    }

    // 사용자의 이름 반환
    @Override
    public String getUsername() {
        return username;
    }

    // 커스텀 메서드: 사용자 ID 반환
    public Long getUserId (){
        return userId;
    }

    // 커스텀 메서드 : 사용자 설정 권한 반환
    public Role getRole (){
        return role;
    }

    public String getEmail(){
        return email;
    }



}

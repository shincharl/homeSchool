package com.homeschool.seungcheol.security;

import com.homeschool.seungcheol.entity.User;
import com.homeschool.seungcheol.enums.Role;
import com.homeschool.seungcheol.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    final private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailServeice loadUserByUsername"); // 디버깅용 출력

        // username으로 사용자 정보를 조회, 없으면 예외 발생
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 사용자 정보 추출
        Long userId = user.getId();
        String usernames = user.getUsername();
        String email = user.getEmail();
        String password = user.getPassword();
        Role role = user.getRole();

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

        // 사용자 정보를 담은 CustomUserDetails 객체를 생성
        CustomUserDetails customUserDetails = new CustomUserDetails(userId, usernames, password, role, email, authorities);

        return customUserDetails;
    }
}

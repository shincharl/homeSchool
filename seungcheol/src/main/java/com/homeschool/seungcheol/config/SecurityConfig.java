package com.homeschool.seungcheol.config;

import com.homeschool.seungcheol.handler.CustomLoginFailureHandler;
import com.homeschool.seungcheol.handler.CustomLoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity // spring security 웹 보안 활성화
public class SecurityConfig {
    
    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(); //BCrypt 알고리즘을 사용한 PasswordEncoder 변환
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            //URL별 접근 권한 설정
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers("/", "/user/register", "/login", "/css/**", "/js/**").permitAll()
                    .anyRequest().authenticated() // 그 외의 요청은 인증 필요
            )
                    // 폼 로그인 설정
                    .formLogin(form -> form
                            .loginPage("/login") // 커스텀 로그인 페이지 경로
                            .successHandler(authenticationSuccessHandler())
                            .failureHandler(authenticationFailureHandler())
                            .permitAll() // 로그인 페이지는 인증 없이 접근 가능
                            .defaultSuccessUrl("/", true) // 로그인 성공 시 "/todos"로 리다이렉트 (항상)
                    )
                    // 로그아웃 설정
                    .logout(logout -> logout
                            .logoutUrl("/logout") // 로그아웃 요청 URL
                            .logoutSuccessUrl("/login?logout") // 로그아웃 성공 시 이동할 URL
                            .permitAll()
                    );

            return http.build();
        }
        
        // 로그인 성공 시 실행될 핸들러 Bean 등록
        @Bean
        AuthenticationSuccessHandler authenticationSuccessHandler(){
            return new CustomLoginSuccessHandler(); // 커스텀 로그인 성공 핸들러 반환
        }

        // 로그인 실패 시 실행될 핸들러 Bean 등록
        @Bean
        AuthenticationFailureHandler authenticationFailureHandler(){
            return new CustomLoginFailureHandler(); // 커스텀 로그인 실패 핸들러 반환
        }
    }
}

package com.homeschool.seungcheol.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

@Slf4j
// 로그인 성공 시 실행되되는 커스텀 핸들러 클래스
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    // 로그인 성공 시 호출되는 메서드
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        log.info("onAuthenticationSuccess"); // 성공 로그 출력

        String targetUrl = "/"; // 로그인 성공 후 이동할 기본 URL 설정
        response.sendRedirect(targetUrl); // 해당 Url로 리다이렉트

    }





}

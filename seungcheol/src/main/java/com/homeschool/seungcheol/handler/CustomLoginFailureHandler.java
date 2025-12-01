package com.homeschool.seungcheol.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;

import java.io.IOException;

@Slf4j
public class CustomLoginFailureHandler implements AuthenticationFailureHandler {

    // 인증 요청이 저장된 캐시에서 이전 요청을 가져오기 위한 객체
    //로그인이 실패하면 사용자가 처음 접근하려던 URL을 기억해둔다.
   private RequestCache requestCache = new HttpSessionRequestCache();

    // 로그인 실패 시 호출되는 메서드
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        
        // 로그인 실패 예외를 로그로 출력
        log.info("onAuthenticationFailure exception" + exception);

        // 사용자가 원래 가려던 요청 정보 가져오기
        SavedRequest savedRequest = requestCache.getRequest(request, response);

        if(savedRequest != null){
            String targetUrI = savedRequest.getRedirectUrl(); // 원래 요청한 URL

            // 실패 시 리다이렉트할 URL 로그 출력
            log.info("Login Failure targetUrl" + targetUrI);

            // 사용자가 가려던 URL로 리다이렉트 (로그인 실패 후에도 이동)
            response.sendRedirect(targetUrI);
        }
    }


}

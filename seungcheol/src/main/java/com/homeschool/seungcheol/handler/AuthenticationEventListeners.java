package com.homeschool.seungcheol.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Slf4j
@Component
// 스프링 시큐리티 인증 관련 이벤트들을 수신하여 처리하는 리스너 클래스
public class AuthenticationEventListeners {

    // 모든 인증 이벤트의 공통 처리
    @EventListener
    public void handleAuthenticationEvent(AbstractAuthenticationEvent event){
        log.info("handleAuthenticationEvent" + event); // 인증 이벤트 발생 시 로그 출력
    }
    
    // 로그인 실패 이벤트 처리 (잘못된 자격 증명)
    @EventListener
    public void handleBadCredentials(AuthenticationFailureBadCredentialsEvent event){
        log.info("handleBadCredentials"); // 로그인 실패 시 로그 출력
    }
    
    // 로그인 성공 이벤트 처리
    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event){
        log.info("handleAuthenticationSuccess");
    }

}

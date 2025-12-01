package homeSchool.com.security;

import homeSchool.com.entity.User;
import homeSchool.com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

//Spring Security에서 사용자 인증 정보를 불러오기 위한 서비스 클래스
@Service // 이 클래스가 Service 컴포넌트임을 명시
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

     final private UserRepository userRepository;

    // username을(email)을 기준으로 사용자 정보를 로딩하는 메서드
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailService loadUserByUsername"); // 디버깅용 출력

        // username으로 사용자 정보를 조회, 없으면 예외 발생
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 사용자 정보 추출
        Long userId = user.getId(); // 사용자 ID
        String email = user.getUsername(); // 사용자 이메일
        String password = user.getPassword(); // 사용자 비밀번호

        // 권한 리스트 생성 및 "ROLE_USER" 권한 추가
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER"); // 기본 권한 부여
        authorities.add(authority);

        // 사용자 정보를 담은 CustomUserDetails 객체를 생성
        CustomUserDetails customUserDetails = new CustomUserDetails(userId, email, password, authorities);


        return customUserDetails; // Spring Security가 인증에 사용할 사용자 정보 반환
    }
}

package homeSchool.com.service;

import homeSchool.com.entity.User;
import homeSchool.com.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository; // User 엔티티 관련 DB 작업을 담당하는 리포지토리
    private final PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 인코더

    public User registerUser(String username, String password){

        // 이미 동일한 username이 존재하는지 확인
        if(userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists"); // 존재할 경우 예외 발생
        }

        // 새로운 User 객체 생성 및 정보 설정
        User user = new User();
        user.setUsername(username); // 사용자 이름 설정
        user.setPassword(passwordEncoder.encode(password)); // 비밀번호 암호화 후 설정

        return userRepository.save(user); // DB에 저장 후 저장된 객체 반환

    }

    // 사용자 이름으로 사용자 정보를 조회하는 메서드
    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username); // 존재 여부에 따라 Optional로 반환
    }
}

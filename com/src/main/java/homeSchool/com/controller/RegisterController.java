package homeSchool.com.controller;

import homeSchool.com.entity.Member;
import homeSchool.com.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.regex.Pattern;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RegisterController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Member member){

        // 비밀번호 강도 체크
        String password = member.getPassword();
        if(!isValidPassword((password))){
            return ResponseEntity.badRequest()
                    .body("비밀번호는 최소 8자, 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다.");
        }
        
        // 아이디 중복 체크
        if(memberRepository.existsByUserId(member.getUserId())){
            return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
        }
        
        // 비밀번호 암호화 후 저장
        String encodedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(encodedPassword);

        memberRepository.save(member);

        return ResponseEntity.ok("회원가입 성공");
    }
    
    private boolean isValidPassword(String password){
        // 최소 8자리, 하나 이상의 대문자, 소문자, 숫자, 특수문자 포함
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*])[a-zA-Z0-9!@#\\$%\\^&\\*]{8,}$";
        return Pattern.matches(regex, password);
    }
}

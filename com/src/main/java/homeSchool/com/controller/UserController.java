package homeSchool.com.controller;

import homeSchool.com.entity.User;
import homeSchool.com.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.regex.Pattern;

@RequiredArgsConstructor
@Controller
@RequestMapping("/users") // "/users" 경로로 들어오는 요청들을 처리함
public class UserController {

    private final UserService userService; // 사용자 관련 서비스 의존성 주입

    //회원가입 폼을 보여주는 메서드
    @GetMapping("/register")
    public String showRegistrationForm(Model model){
        model.addAttribute("user", new User()); // 빈 User 객체를 모델에 추가하여 폼에서 바인딩할 수 있게 함
        return "register";
    }

    //회원가입 처리를 담당하는 메서드
    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") User user, BindingResult result, Model model) {

        // 이메일 형식을 검증하기 위한 정규 표현식
        String emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";

        // 사용자 이름(이메일)이 정규식과 일치하지 않으면 에러 처리
        if(!Pattern.matches(emailPattern, user.getUsername())){
            result.rejectValue("username", "error.user", "Invalid email format Please enter a valid email address"); //BindingResult에 에러 등록
            model.addAttribute("emailError", "Invalid email format. Please enter a valid email address"); // 뷰에 표시할 에러 메시지 추가
        }

        // 에러가 존재하면 다시 회원가입 페이지로 이동
        if(result.hasErrors()){
            return "register";
        }

        // 사용자 등록 처리
        userService.registerUser(user.getUsername(), user.getPassword()); // 사용자 서비스에서 회원가입 처리
        return "redirect:/login";

    }
}

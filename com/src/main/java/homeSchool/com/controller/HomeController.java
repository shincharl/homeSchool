package homeSchool.com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // 이 클래스는 Spring MVC의 컨트롤러로 동작함을 나타냄
public class HomeController {

    // 투트경로에 대한 Get 요청을 처리하는 메서드
    @GetMapping("/")
    public String home(){
        return "index"; // "index라는 이름의 뷰(템플릿)을 반환"
    }

    @GetMapping("/login")
    public String login(){
        return "login"; // "login이라는 이름의 뷰(템플릿)을 반환"
    }

    @GetMapping("/logout")
    public String logout(){
        return "redirect:login?logout";
    }
}

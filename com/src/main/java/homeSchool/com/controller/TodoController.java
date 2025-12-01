package homeSchool.com.controller;

import homeSchool.com.entity.Todo;
import homeSchool.com.entity.User;
import homeSchool.com.security.CustomUserDetails;
import homeSchool.com.service.TodoService;
import homeSchool.com.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Controller
@RequestMapping("/todos")
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    @GetMapping
    public String listTodos(Authentication authentication, Model model){
        Object principal = authentication.getPrincipal();// 현재 인증된 사용자 정보 조회

        if(principal == null){ // 인증 정보가 없으면 로그인 페이지로 리다이렉트
            return "redirect:/login";
        }

        CustomUserDetails customUserDetails = (CustomUserDetails)principal; // 사용자 정보를 커스텀 객체로 캐스팅

        Optional<User> user = userService.findByUsername(customUserDetails.getUsername());
        if(user.isEmpty()) { // 사용자가 존재하지 않으면 로그인 페이지로 리다일렉트
            return "redirect:/login";
        }

        List<Todo> todos = todoService.getTodosByUser(user.get());// 해당 사용자에 대한 할 일 목록 조회
        model.addAttribute("todos",todos);
        return "todos";
    }

    // 새로운 할 일을 추가하는 메서드
    @PostMapping("/add")
    public String addTodo(Authentication authentication, @ModelAttribute Todo todo){
        Object principal = authentication.getPrincipal();// 인증 정보 획득

        if(principal == null){ // 인증 정보가 없으면 로그인 페이지로
            return "redirect:/login";
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) principal;

        User user = new User(); // 사용자 객체 생성
        user.setId(customUserDetails.getUserId()); // 현재 로그인한 사용자의 ID 설정

        todoService.addTodo(todo, user); // 할 일을 사용자와 함께 저장
        return "redirect:/todos"; // 목록 페이지로 리다이렉트

    }

    // 특정 ID의 할 일을 수정하기 위해 데이터를 조회하는 메서드
    @GetMapping("/edit/{id}")
    public String editTodo(@PathVariable("id") Long id, Model model, Authentication authentication){
        Object principal= authentication.getPrincipal();

        if(principal == null){
            return "redirect:/login";
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) principal;

        Long userId = customUserDetails.getUserId();

        Optional<Todo> todo = todoService.getTodoById(id);// 해당 ID의 할일 조회

        // 해당 할 일이 존재하고, 로그인한 사용자의 소유인지 확인
        if(todo.isPresent()&&todo.get().getUser().getId().equals(userId)){
            model.addAttribute("todo", todo.get()); // 모델에 할 일 정보 추가
            return "edit_todo"; // 수정 폼 페이지 반환
        }
        return "redirect:/todos";  // 조건 미충족 시 목록으로 리다이렉트
    }

    // 특정 ID의 할 일을 실제로 수정하는 메서드
    @PostMapping("/update/{id}")
    public String updateTodo(@PathVariable("id") Long id, @RequestParam("title") String title, @RequestParam("description") String description, Authentication authentication){

        Object principal = authentication.getPrincipal();

        if(principal==null){
            return "redirect:/login";
        }

        CustomUserDetails customUserDetails = (CustomUserDetails) principal;

        User user = new User();
        user.setId(customUserDetails.getUserId());

        todoService.updateTodo(id, title, description, user); // 수정된 정보로 업데이트
        return "redirect:/todos"; // 목록으로 리다이렉트
    }


}

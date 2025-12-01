package homeSchool.com.service;

import homeSchool.com.entity.Todo;
import homeSchool.com.entity.User;
import homeSchool.com.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository; // 할 일 관련 DB 접근을 위한 리포지토리

    // 새로운 Todo를 추가하고 DB에 저장하는 메서드
    public Todo addTodo(Todo todo, User user){
        todo.setUser(user); // 해당 할 일에 사용자 정보 설정
        return todoRepository.save(todo); // DB에 저장 후 저장된 객체 반환
    }

    // 특정 사용자의 Todo 목록을 조회하는 메서드
    public List<Todo> getTodosByUser(User user){
        return todoRepository.findByUserId(user.getId()); // user_id 기준으로 조회
    }

    // 특정 ID의 Todo를 삭제하는 메서드 (소유자 확인 포함)
    public void deleteTodoById(Long id, User user){
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        // 현재 사용자와 해당 할 일의 소유자가 일치하지 않으면 보안 예외 발생
        if(todo.getUser().getId().equals(user.getId())){
            throw new SecurityException("Unauthorized");
        }

        // 검증 통과 시 삭제
        todoRepository.deleteById(id);
    }

    // ID로 Todo를 조회하여 Optional로 반환 (수정 폼 등에 사용)
    public Optional<Todo> getTodoById(Long id){
        return todoRepository.findById(id);
    }

    // 특정 ID의 Todo를 수정하는 메서드 (소유자 검증 포함)
    public void updateTodo(Long id, String title, String description, User user){
        // ID로 할 일을 조회, 없으면 예외
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        // 현재 사용자와 할 일의 소유자가 일치하지 않으면, 예외 발생
        if(!todo.getUser().getId().equals(user.getId())){
            throw new SecurityException("Unauthorized");
        }

        // 제목과 설명을 수정하고 저장
        todo.setTitle(title);
        todo.setDescription(description);
        todoRepository.save(todo);
    }

}

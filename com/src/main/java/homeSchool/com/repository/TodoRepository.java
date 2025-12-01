package homeSchool.com.repository;

import homeSchool.com.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Todo 엔티티를 위한 JPA Repository 인터페이스
// 기본적인 CRUD 메서드를 JpaRepository에서 상속받아 사용할 수 있음
public interface TodoRepository extends JpaRepository<Todo, Long> {

    // 특정 사용자 ID에 해당하는 할 일 목록을 조회하는 메서드
    List<Todo> findByUserId(Long userId); // user_id로 할 일 목록을 조회


}

package homeSchool.com.repository;


import homeSchool.com.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 사용자 이름으로 사용자 정보를 조회하는 메소드
    // 존재하지 않을 수도 있으므로, Optional로 감싸 반환
    Optional<User> findByUsername(String username); //username

}

package com.homeschool.seungcheol.repository;

import com.homeschool.seungcheol.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 사용자 이름으로 사용자 정보를 조회하는 메소드
    Optional<User> findByUsername(String username);

}

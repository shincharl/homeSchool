package homeSchool.com.repository;

import homeSchool.com.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // userId로 회원 존재 여부 확인
    boolean existsByUserId(String userId);

    // userId로 회원 조회
    Optional<Member> findByUserId(String userId);
}

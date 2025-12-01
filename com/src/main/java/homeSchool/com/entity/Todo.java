package homeSchool.com.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // 할 일 제목
    private String description; // 할 일 설명
    private boolean completed; // 완료 여부 (true: 완료됨, false: 미완료)

    // 다대일 관계를 매핑

    @ManyToOne // 다대일 관계 매핑 - 하나의 사용자는 여러 개의 할 일을 가질 수 있음
    @JoinColumn(name = "user_id", nullable = false) // 외래 키로 user_id 컬럼을 사용하며, null을 허용하지 않음
    private User user; // 이 할 일을 소유한 사용자

    
}

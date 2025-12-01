package homeSchool.com.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // 사용자 이름
    private String password; // 사용자 비밀번호

    @OneToMany(mappedBy = "user")
    private Set<Todo> todos;

}

package homeSchool.com.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column
    private String name;

    @Column
    private String nickName;

    @Column
    private String userId;

    @Column
    private String password;

    @Column
    private String address;

    @Column
    private String email;

    @Builder.Default
    @OneToMany(mappedBy = "member")
    private List<Contact> contacts = new ArrayList<>();

}

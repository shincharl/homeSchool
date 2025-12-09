package homeSchool.com.dto;

import homeSchool.com.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AllContactsDTO {

    private Long id;

    private String title;

    private String memberNickname;

    private LocalDateTime createdAt;

    private Integer readCount;

}

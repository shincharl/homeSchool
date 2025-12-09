package homeSchool.com.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ContactDetailDTO {
    private Long id;

    private String title;

    private String content;

    private String memberNickname;

    private LocalDateTime createdAt;

    private Integer readCount;
}

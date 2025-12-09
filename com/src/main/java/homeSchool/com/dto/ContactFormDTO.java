package homeSchool.com.dto;

import homeSchool.com.entity.Contact;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class ContactFormDTO {

    private String title;

    private String content;

    public Contact toEntity() {
        return Contact.builder()
                .title(title)
                .content(content)
                .readCount(0)
                .build();
    }
}

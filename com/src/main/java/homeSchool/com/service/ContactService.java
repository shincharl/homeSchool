package homeSchool.com.service;

import homeSchool.com.dto.ContactUpdateDTO;
import homeSchool.com.entity.Contact;
import homeSchool.com.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    @Transactional
    public void updateContact(Long id, ContactUpdateDTO dto, String nickName)
            throws IllegalAccessException {

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        // 작성자 검증
        if(!contact.getMember().getNickName().equals(nickName)){
            throw new IllegalAccessException("작성자만 수정 가능");
        }

        contact.setTitle(dto.getTitle());
        contact.setContent(dto.getContent());
    }
}

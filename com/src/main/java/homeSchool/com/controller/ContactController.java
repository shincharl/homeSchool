package homeSchool.com.controller;

import homeSchool.com.dto.AllContactsDTO;
import homeSchool.com.dto.ContactDetailDTO;
import homeSchool.com.dto.ContactFormDTO;
import homeSchool.com.entity.Contact;
import homeSchool.com.repository.ContactRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping("/contact/new")
    public String CreateContact(@RequestBody ContactFormDTO contactFormDTO) {
        log.info(contactFormDTO.toString());

        // 1. DTO를 엔티티로 변환
        Contact contact = contactFormDTO.toEntity();

        // 2. 리파지터리로 엔티티를 DB에 저장
        Contact saved = contactRepository.save(contact);

        log.info(saved.toString());
        return "{\"response\": \"ok\"}";
    }

    @GetMapping("/contacts")
    public List<AllContactsDTO> index(Model model){
        // 1. 모든 데이터 가져오기
        List<Contact> contacts = contactRepository.findAll();

        // 2. DTO로 변환
        List<AllContactsDTO> dtoList = contacts.stream()
                .map(contact -> new AllContactsDTO(
                        contact.getId(), // 1. id
                        contact.getTitle(), // 2. title
                        contact.getMember() != null ? contact.getMember().getNickName() : null, // 닉네임
                        contact.getCreatedAt(), // 3. memberNickname
                        contact.getReadCount() // 조회수
                ))
                .toList();


        return dtoList;
    }

    @GetMapping("/contact/{id}")
    public ContactDetailDTO show(@PathVariable Long id){
        log.info("id = " + id);
        
        // 1. id를 조회해 데이터 가져오기
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시물입니다."));

        return new ContactDetailDTO(
                contact.getId(),
                contact.getTitle(),
                contact.getContent(),
                contact.getMember() != null ? contact.getMember().getNickName() : null,
                contact.getCreatedAt(),
                contact.getReadCount()
        );
    }

}

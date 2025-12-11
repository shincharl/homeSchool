package homeSchool.com.controller;

import homeSchool.com.dto.AllContactsDTO;
import homeSchool.com.dto.ContactDetailDTO;
import homeSchool.com.dto.ContactFormDTO;
import homeSchool.com.entity.Contact;
import homeSchool.com.entity.Member;
import homeSchool.com.repository.ContactRepository;
import homeSchool.com.repository.MemberRepository;
import homeSchool.com.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ContactController {


    private final ContactRepository contactRepository;
    private final MemberRepository memberRepository;

    @PostMapping("/api/contact/new")
    public String CreateContact(@RequestBody ContactFormDTO contactFormDTO,
                                @AuthenticationPrincipal CustomUserDetails userDetails) {

        if(userDetails == null) {
            throw new IllegalArgumentException("로그인 정보가 없습니다.");
        }

        if(contactFormDTO.getTitle() == null || contactFormDTO.getTitle().trim().isEmpty()){
            throw new IllegalArgumentException("제목이 비어있습니다.");
        }

        if(contactFormDTO.getContent() == null || contactFormDTO.getContent().trim().isEmpty()){
            throw new IllegalArgumentException("내용이 비어있습니다.");
        }

        Member member = memberRepository.findByUserId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 1. DTO를 엔티티로 변환
        Contact contact = contactFormDTO.toEntity(member);
        //contact.setMember(member);

        // 2. 리파지터리로 엔티티를 DB에 저장
        Contact saved = contactRepository.save(contact);

        log.info(saved.toString());
        return "{\"response\": \"ok\"}";
    }

    @GetMapping("/api/contacts")
    public Page<AllContactsDTO> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ){

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Contact> contactPage;

        if(keyword != null && !keyword.isEmpty()){
            contactPage = contactRepository.searchByTitleOrNickname(
                    keyword, pageRequest
            );
        } else {
            contactPage = contactRepository.findAll(pageRequest);
        }

        // 2. DTO로 변환 (Page.map 사용)
        Page<AllContactsDTO> dtoPage = contactPage.map(contact ->
                new AllContactsDTO(
                        contact.getId(),
                        contact.getTitle(),
                        contact.getMember() != null ? contact.getMember().getNickName() : null,
                        contact.getCreatedAt(),
                        contact.getReadCount()
                )
        );


        return dtoPage;
    }

    @GetMapping("/api/contact/{id}")
    @Transactional
    public ContactDetailDTO show(@PathVariable Long id){
        log.info("id = " + id);
        
        // 1. id를 조회해 데이터 가져오기
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시물입니다."));

        // 2. 조회수 증가
        contact.setReadCount(contact.getReadCount() + 1);

        return new ContactDetailDTO(
                contact.getId(),
                contact.getTitle(),
                contact.getContent(),
                contact.getMember() != null ? contact.getMember().getNickName() : null,
                contact.getCreatedAt(),
                contact.getReadCount()
        );
    }

    @DeleteMapping("/api/contact/{id}")
    @Transactional
    public ResponseEntity<?> deleteContext(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user
    ){
        // 로그인 정보 없으면 401
        if (user == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        
        // 1. 게시글 찾기
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 2. 작성자 본인인지 확인
        Long currentUserId = user.getMemberId(); // 커스텀 유저의 멤버 ID
        Long writerId = contact.getMember().getId(); // 게시글 작성자 ID

        if(!writerId.equals(currentUserId)){
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        // 4. 삭제 수행
        contactRepository.delete(contact);

        return ResponseEntity.ok("삭제 완료");
    }

}

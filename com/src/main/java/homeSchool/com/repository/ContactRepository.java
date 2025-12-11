package homeSchool.com.repository;

import homeSchool.com.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c " +
           "LEFT JOIN c.member m " +
            "WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(m.nickName) LIKE LOWER(CONCAT('%', :keyword, '%')) ")
    Page<Contact> searchByTitleOrNickname(@Param("keyword") String keyword, Pageable pageable);

}

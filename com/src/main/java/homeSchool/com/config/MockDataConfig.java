package homeSchool.com.config;

import homeSchool.com.entity.Member;
import homeSchool.com.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MockDataConfig {

    @Bean
    public CommandLineRunner mockMemberData(MemberRepository memberRepository){
        return args -> {
            
            memberRepository.save(Member.builder()
                    .name("홍길동")
                    .nickName("길동이")
                    .userId("hong123")
                    .password("1234")
                    .address("서울시 강남구")
                    .email("hong@example.com")
                    .build()
            );

            memberRepository.save(Member.builder()
                    .name("김철수")
                    .nickName("철수맨")
                    .userId("cheolsu99")
                    .password("abcd")
                    .address("부산시 해운대구")
                    .email("cs@example.com")
                    .build()
            );
            
        };
    }
}

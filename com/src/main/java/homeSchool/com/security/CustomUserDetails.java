package homeSchool.com.security;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Locale;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L; // 직렬화 버전 UID

    private final Long userId; // 사용자 고유 ID
    private final String username; // 사용자 이름
    private final String password; // 사용자 비밀번호

    // 사용자의 권한 목록
    private final Collection<? extends GrantedAuthority> authorities;

    // 사용자의 권한 정보 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // 사용자의 비밀번호 반환
    @Override
    public String getPassword() {
        return password;
    }

    // 사용자 이름 반환
    @Override
    public String getUsername() {
        return username;
    }

    // 커스텀 메서드: 사용자 ID 반환
    public Long getUserId (){
        return userId;
    }

//    계정 만료 여부 (true = 만료되지 않음)
//    @Override
//    public boolean isAccountNonExpired() {
//        return UserDetails.super.isAccountNonExpired();
//    }
//    계정 잠김 여부 (true = 잠기지 않음)
//    @Override
//    public boolean isAccountNonLocked() {
//        return UserDetails.super.isAccountNonLocked();
//    }
//    자격 증명(비밀번호) 만료 여부
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return UserDetails.super.isCredentialsNonExpired();
//    }
//   계정 활성화 여부 
//    @Override
//    public boolean isEnabled() {
//        return UserDetails.super.isEnabled();
//    }
}

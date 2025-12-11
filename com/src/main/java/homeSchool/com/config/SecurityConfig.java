package homeSchool.com.config;

import homeSchool.com.service.CustomUserDetails;
import homeSchool.com.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // 구현한 UserDetailService 연결
        authProvider.setPasswordEncoder(passwordEncoder()); // BCryptPasswordEncoder
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider authProvider) throws Exception {
        http
                .authenticationProvider(authProvider) // 여기에 provider 등록
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll() // H2 콘솔 허용
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/register").permitAll()
                        .requestMatchers("/api/contacts").permitAll() // 누구나 접근 가능
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login") // POST 요청 처리
                        .successHandler((req, res, auth) -> {

                            Object principal = auth.getPrincipal();
                            String nickname = "";

                            if(principal instanceof CustomUserDetails customUser){
                                nickname = customUser.getNickname();
                            }

                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"success\",\"nickname\":\"" + nickname + "\"}");
                        })
                        .failureHandler((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"fail\"}");
                        })
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"error\":\"unauthorized\", \"redirect\":\"/login\"}");
                        })
                );


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));


        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true); // 쿠키/토큰 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

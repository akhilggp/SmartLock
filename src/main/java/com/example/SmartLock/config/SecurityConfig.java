package com.example.SmartLock.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                // Enable CSRF protection
//                .csrf(csrf -> csrf
//                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                        // Optionally, specify endpoints to ignore CSRF protection
//                        //.ignoringRequestMatchers("/api/**") // Uncomment if you have stateless API endpoints
//                )
//                // Configure authorization rules
//                .authorizeHttpRequests(authorize -> authorize
//                        // Public endpoints that don't require authentication
//                        .requestMatchers("/public/**").permitAll()
//                        // All other endpoints require authentication
//                        .anyRequest().authenticated()
//                )
//                // Configure form-based authentication
//                //***make changes here when including jwt tokens when adding CORS(connecting to react)***
//                .formLogin(form -> form
//                        .loginPage("/login") // Specify your custom login page URL
//                        .permitAll() // Allow everyone to see the login page
//                        .defaultSuccessUrl("/home", true) // Redirect to /home upon successful login
//                )
//
//                // Configure logout functionality
//                .logout(logout -> logout
//                        .logoutUrl("/logout") // Specify the logout URL
//                        .logoutSuccessUrl("/login?logout") // Redirect to login page after logout
//                        .permitAll() // Allow everyone to access logout
//                );

        http.csrf(AbstractHttpConfigurer::disable) // Disable CSRF (if appropriate)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/register", "/login").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults()); // Enable HTTP Basic authentication

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

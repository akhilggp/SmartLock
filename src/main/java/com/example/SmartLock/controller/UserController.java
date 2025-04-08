package com.example.SmartLock.controller;

import com.example.SmartLock.handler.LoginRequestHandler;
import com.example.SmartLock.handler.RegistrationRequestHandler;
import com.example.SmartLock.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;

    //@RequestBody maps the json that comes in into the Handler.
    //The incoming JSON is automatically mapped to the LoginRequestHandler object (a simple POJO with email and password fields).
    //You also receive the raw HttpServletRequest, used to create a session and store the security context.
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody RegistrationRequestHandler requestHandler) {
        return userService.registerUser(
                requestHandler.getEmail(),
                requestHandler.getPassword(),
                requestHandler.getFirstname(),
                requestHandler.getLastname()
        );
    }

    // Handlers are those that the incoming data is mapped to and HttpServletRequest is to know about the request that comes in.
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequestHandler requestHandler, HttpServletRequest request) {
        try {
            // Authentication
           Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            requestHandler.getEmail(),
                            requestHandler.getPassword()
                    )
            );
          // Set Authentication in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Ensure Session exists
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext());
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }

    @GetMapping("/home")
    public ResponseEntity<Map<String, String>> homePage(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Unauthorized Access"));
        }

        return ResponseEntity.ok(Map.of("message", "Welcome Home," + user.getUsername()));
    }

    @GetMapping("/csrf-token")
    public ResponseEntity<Map<String, String>> getCsrfToken(HttpServletRequest request, HttpServletResponse response) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate CSRF token"));
        }
        return ResponseEntity.ok(Map.of("csrfToken", csrfToken.getToken()));
    }
}

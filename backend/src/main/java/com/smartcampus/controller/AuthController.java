package com.smartcampus.controller;

import com.smartcampus.dto.request.LoginRequest;
import com.smartcampus.dto.request.RegisterRequest;
import com.smartcampus.dto.response.AuthResponse;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepository;

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** GET /api/auth/me - Get current logged-in user info */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of(
            "id",    user.getId(),
            "name",  user.getName(),
            "email", user.getEmail(),
            "role",  user.getRole().name()
        ));
    }

    /** GET /api/auth/google - Redirect to Google OAuth */
    @GetMapping("/google")
    public ResponseEntity<Map<String, String>> googleLogin() {
        return ResponseEntity.ok(Map.of(
            "url", "http://localhost:8081/oauth2/authorization/google"
        ));
    }
}

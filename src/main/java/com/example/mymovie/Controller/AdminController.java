package com.example.mymovie.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mymovie.Repository.UserRepository;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {
    private final UserRepository userRepository;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        // Return stats like total users, total movies, etc.
        // Implementation depends on your needs
        return ResponseEntity.ok().build();
    }
}
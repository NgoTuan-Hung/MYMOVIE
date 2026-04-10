package com.example.mymovie.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.mymovie.Entity.User;
import com.example.mymovie.Enum.Role;
import com.example.mymovie.Repository.UserRepository;

@Component
public class AdminSeeder implements CommandLineRunner { // 👈 runs automatically on app startup

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only create if no admin exists yet
        boolean adminExists = userRepository.findByEmail("admin@mymovie.com").isPresent();

        if (!adminExists) {
            User admin = new User();
            admin.setEmail("admin@mymovie.com");
            admin.setPassword(passwordEncoder.encode("12345678")); // 👈 change this!
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@mymovie.com");
        } else {
            System.out.println("ℹ️ Admin already exists, skipping seed.");
        }
    }
}

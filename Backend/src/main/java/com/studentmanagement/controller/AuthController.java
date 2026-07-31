package com.studentmanagement.controller;

import com.studentmanagement.dto.LoginRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Backend Step 7 — Business Logic: admin authentication.
 *
 * POST /api/auth/login  ->  checks the administrator credentials.
 *
 * The username and password are read from application.properties, so they are
 * not hard-coded in the source. This is a simple demonstration login that
 * matches the frontend. A production system would use Spring Security with
 * hashed passwords and a real token; that is noted as a next step in the
 * README.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        boolean ok = adminUsername.equals(request.getUsername())
                  && adminPassword.equals(request.getPassword());

        if (!ok) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Invalid username or password"));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "username", adminUsername,
                "message", "Login successful"));
    }
}

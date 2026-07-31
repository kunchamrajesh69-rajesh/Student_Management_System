package com.studentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Carries the login form data from the frontend to the AuthController.
 *
 * A DTO (Data Transfer Object) is a small class used only to move data in a
 * request. It is kept separate from the Student entity because the login form
 * is not a database record.
 */
public class LoginRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

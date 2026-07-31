package com.studentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the Student Management System backend.
 *
 * Backend Step 3 — Set Up the Server:
 * {@code @SpringBootApplication} starts the embedded Tomcat server, scans this
 * package and its sub-packages for components (controllers, services,
 * repositories) and wires them together automatically.
 *
 * Run with:  mvn spring-boot:run
 * The API then listens on http://localhost:8080
 */
@SpringBootApplication
public class StudentManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
    }
}

package com.studentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Backend Step 6 — Create Models and Schemas.
 *
 * This class is both:
 *   1. a JPA entity  -> maps to the {@code student} table in the database, and
 *   2. a validated model -> the annotations below enforce the same rules the
 *      frontend checks, so bad data cannot reach the database even if the
 *      request bypasses the UI.
 *
 * The field names match the JSON the frontend already sends
 * (name, rollNumber, email, phone, course, year, status), so no extra
 * mapping is needed.
 */
@Entity
@Table(
    name = "student",
    // Enforce roll-number uniqueness at the database level as a safety net,
    // in addition to the check in the service layer.
    uniqueConstraints = @UniqueConstraint(columnNames = "roll_number")
)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 60, message = "Name must be between 3 and 60 characters")
    @Pattern(regexp = "^[A-Za-z][A-Za-z\\s.'-]*$",
             message = "Name may contain letters, spaces, apostrophes and hyphens only")
    @Column(nullable = false, length = 60)
    private String name;

    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[A-Za-z0-9-]{3,20}$",
             message = "Roll number must be 3 to 20 letters, numbers or hyphens")
    @Column(name = "roll_number", nullable = false, length = 20)
    private String rollNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Column(nullable = false, length = 120)
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    @Column(nullable = false, length = 10)
    private String phone;

    @NotBlank(message = "Course is required")
    @Column(nullable = false, length = 60)
    private String course;

    @NotNull(message = "Year is required")
    @Min(value = 1, message = "Year must be between 1 and 4")
    @Max(value = 4, message = "Year must be between 1 and 4")
    @Column(nullable = false)
    private Integer year;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "Active|Inactive", message = "Status must be Active or Inactive")
    @Column(nullable = false, length = 10)
    private String status = "Active";

    /* JPA requires a no-argument constructor. */
    public Student() {
    }

    public Student(String name, String rollNumber, String email, String phone,
                   String course, Integer year, String status) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.year = year;
        this.status = status;
    }

    /* ---- Getters and setters (required by JPA and Jackson) ------------- */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

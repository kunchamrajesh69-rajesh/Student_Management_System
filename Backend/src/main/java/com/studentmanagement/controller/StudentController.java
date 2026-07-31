package com.studentmanagement.controller;

import com.studentmanagement.model.Student;
import com.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Backend Steps 4 & 8 — Define Routes, Handle Requests and Responses.
 * Provides REST endpoints for student entity management and analytics.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    /** GET /api/students?search=term&course=B.Tech+CSE&status=Active */
    @GetMapping
    public List<Student> getAll(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "course", required = false) String course,
            @RequestParam(value = "status", required = false) String status) {
        if (search != null || course != null || status != null) {
            return service.searchStudents(search, course, status);
        }
        return service.getAllStudents();
    }

    /** GET /api/students/recent */
    @GetMapping("/recent")
    public List<Student> getRecent() {
        return service.getRecentStudents();
    }

    /** GET /api/students/courses */
    @GetMapping("/courses")
    public List<String> getCourses() {
        return service.getDistinctCourses();
    }

    /** GET /api/students/{id} */
    @GetMapping("/{id}")
    public Student getOne(@PathVariable Long id) {
        return service.getStudentById(id);
    }

    /** POST /api/students */
    @PostMapping
    public ResponseEntity<Student> create(@Valid @RequestBody Student student) {
        Student saved = service.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** PUT /api/students/{id} */
    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @Valid @RequestBody Student student) {
        return service.updateStudent(id, student);
    }

    /** DELETE /api/students/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        service.deleteStudent(id);
        return ResponseEntity.ok(Map.of(
                "deleted", true,
                "id", id,
                "message", "Student record successfully deleted"));
    }

    /** GET /api/students/stats */
    @GetMapping("/stats")
    public Map<String, Long> stats() {
        List<Student> all = service.getAllStudents();
        long active = all.stream().filter(s -> "Active".equalsIgnoreCase(s.getStatus())).count();
        long courses = all.stream().map(Student::getCourse).filter(c -> c != null && !c.isBlank()).distinct().count();
        return Map.of(
                "total", (long) all.size(),
                "active", active,
                "inactive", (long) all.size() - active,
                "courses", courses);
    }
}

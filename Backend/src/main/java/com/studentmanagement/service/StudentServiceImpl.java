package com.studentmanagement.service;

import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.model.Student;
import com.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Backend Step 7 — Implement Business Logic.
 * Manages database interaction via StudentRepository and enforces domain validation.
 */
@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository repository;

    public StudentServiceImpl(StudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    @Override
    public Student getStudentById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No student found with id " + id));
    }

    @Override
    public List<Student> searchStudents(String term) {
        return searchStudents(term, null, null);
    }

    @Override
    public List<Student> searchStudents(String term, String course, String status) {
        String cleanTerm = (term != null) ? term.trim() : "";
        String cleanCourse = (course != null) ? course.trim() : "";
        String cleanStatus = (status != null) ? status.trim() : "";

        return repository.searchFiltered(cleanTerm, cleanCourse, cleanStatus);
    }

    @Override
    public List<Student> getRecentStudents() {
        return repository.findTop5ByOrderByIdDesc();
    }

    @Override
    public List<String> getDistinctCourses() {
        return repository.findDistinctCourses();
    }

    @Override
    public Student createStudent(Student student) {
        normalise(student);

        if (repository.existsByRollNumberIgnoreCase(student.getRollNumber())) {
            throw new DuplicateResourceException(
                    "A student with roll number " + student.getRollNumber() + " already exists");
        }

        student.setId(null); // ensure INSERT
        return repository.save(student);
    }

    @Override
    public Student updateStudent(Long id, Student incoming) {
        Student existing = getStudentById(id);
        normalise(incoming);

        if (repository.existsByRollNumberIgnoreCaseAndIdNot(incoming.getRollNumber(), id)) {
            throw new DuplicateResourceException(
                    "Another student already uses roll number " + incoming.getRollNumber());
        }

        existing.setName(incoming.getName());
        existing.setRollNumber(incoming.getRollNumber());
        existing.setEmail(incoming.getEmail());
        existing.setPhone(incoming.getPhone());
        existing.setCourse(incoming.getCourse());
        existing.setYear(incoming.getYear());
        existing.setStatus(incoming.getStatus());

        return repository.save(existing);
    }

    @Override
    public void deleteStudent(Long id) {
        Student existing = getStudentById(id);
        repository.delete(existing);
    }

    @Override
    public long countStudents() {
        return repository.count();
    }

    /** Trims and normalises case so stored data is consistent. */
    private void normalise(Student s) {
        if (s.getName() != null)       s.setName(s.getName().trim());
        if (s.getRollNumber() != null) s.setRollNumber(s.getRollNumber().trim().toUpperCase());
        if (s.getEmail() != null)      s.setEmail(s.getEmail().trim().toLowerCase());
        if (s.getPhone() != null)      s.setPhone(s.getPhone().trim());
        if (s.getCourse() != null)     s.setCourse(s.getCourse().trim());
        if (s.getStatus() == null || s.getStatus().isBlank()) s.setStatus("Active");
    }
}

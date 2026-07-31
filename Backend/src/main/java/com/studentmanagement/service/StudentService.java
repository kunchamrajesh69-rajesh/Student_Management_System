package com.studentmanagement.service;

import com.studentmanagement.model.Student;

import java.util.List;

/**
 * Backend Step 7 — Implement Business Logic (contract).
 */
public interface StudentService {

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    List<Student> searchStudents(String term);

    List<Student> searchStudents(String term, String course, String status);

    List<Student> getRecentStudents();

    List<String> getDistinctCourses();

    Student createStudent(Student student);

    Student updateStudent(Long id, Student student);

    void deleteStudent(Long id);

    long countStudents();
}

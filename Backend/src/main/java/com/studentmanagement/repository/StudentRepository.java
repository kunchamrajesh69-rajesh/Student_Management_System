package com.studentmanagement.repository;

import com.studentmanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Backend Step 5 — Connect to the Database (Repository layer).
 * Provides JPA repository methods and custom JPQL database queries.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /** Checks if a roll number exists (case-insensitive). */
    boolean existsByRollNumberIgnoreCase(String rollNumber);

    /** Checks if a roll number exists for another student record during update. */
    boolean existsByRollNumberIgnoreCaseAndIdNot(String rollNumber, Long id);

    /**
     * Search across name, roll number, email, and course.
     */
    List<Student> findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCaseOrEmailContainingIgnoreCaseOrCourseContainingIgnoreCase(
            String name, String rollNumber, String email, String course);

    /**
     * Advanced multi-criteria search database query with optional filtering.
     */
    @Query("SELECT s FROM Student s WHERE " +
           "(:term IS NULL OR :term = '' OR " +
           " LOWER(s.name) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           " LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           " LOWER(s.email) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           " LOWER(s.phone) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           " LOWER(s.course) LIKE LOWER(CONCAT('%', :term, '%'))) AND " +
           "(:course IS NULL OR :course = '' OR LOWER(s.course) = LOWER(:course)) AND " +
           "(:status IS NULL OR :status = '' OR LOWER(s.status) = LOWER(:status)) " +
           "ORDER BY s.id DESC")
    List<Student> searchFiltered(@Param("term") String term,
                                 @Param("course") String course,
                                 @Param("status") String status);

    /** Counts students matching a specific status (Active / Inactive). */
    @Query("SELECT COUNT(s) FROM Student s WHERE LOWER(s.status) = LOWER(:status)")
    long countByStatus(@Param("status") String status);

    /** Returns list of unique courses in the system. */
    @Query("SELECT DISTINCT s.course FROM Student s ORDER BY s.course ASC")
    List<String> findDistinctCourses();

    /** Returns top 5 most recently created students. */
    List<Student> findTop5ByOrderByIdDesc();
}

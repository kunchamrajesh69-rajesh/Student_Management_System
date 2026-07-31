package com.studentmanagement.config;

import com.studentmanagement.model.Student;
import com.studentmanagement.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Inserts a few sample students the first time the application starts, so the
 * database is not empty during a demo. These are the same records the frontend
 * seeds, so both halves of the project show the same data.
 *
 * It only runs when the table is empty, so it never duplicates data or
 * overwrites records added later.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository repository;

    public DataSeeder(StudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return; // data already present, do nothing
        }

        repository.save(new Student("Aarav Sharma",  "22CS001", "aarav.sharma@college.edu",  "9876543210", "Computer Science",        3, "Active"));
        repository.save(new Student("Diya Reddy",    "22CS002", "diya.reddy@college.edu",    "9876543211", "Computer Science",        3, "Active"));
        repository.save(new Student("Rohan Verma",   "22EC014", "rohan.verma@college.edu",   "9876543212", "Electronics",             2, "Active"));
        repository.save(new Student("Sneha Patil",   "21ME108", "sneha.patil@college.edu",   "9876543213", "Mechanical",              4, "Inactive"));
        repository.save(new Student("Karthik Nair",  "23IT045", "karthik.nair@college.edu",  "9876543214", "Information Technology",  1, "Active"));
        repository.save(new Student("Ananya Iyer",   "22CS019", "ananya.iyer@college.edu",   "9876543215", "Computer Science",        3, "Active"));
        repository.save(new Student("Vikram Singh",  "21CV072", "vikram.singh@college.edu",  "9876543216", "Civil",                   4, "Active"));
        repository.save(new Student("Meera Joshi",   "23EC031", "meera.joshi@college.edu",   "9876543217", "Electronics",             1, "Inactive"));

        System.out.println(">> Seeded 8 sample students.");
    }
}

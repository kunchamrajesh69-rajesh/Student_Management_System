-- ====================================================================
-- Student Management System - Database Schema DDL
-- Compatible with MySQL 8.0+ and H2 Database
-- ====================================================================

CREATE TABLE IF NOT EXISTS student (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    course VARCHAR(60) NOT NULL,
    `year` INT NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'Active'
);

package com.studentmanagement.exception;

/**
 * Thrown when a roll number is already in use.
 * The global handler turns this into a 409 Conflict response.
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

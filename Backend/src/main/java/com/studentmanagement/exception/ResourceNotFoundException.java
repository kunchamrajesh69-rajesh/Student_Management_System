package com.studentmanagement.exception;

/**
 * Thrown when a requested student does not exist.
 * The global handler turns this into a 404 Not Found response.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

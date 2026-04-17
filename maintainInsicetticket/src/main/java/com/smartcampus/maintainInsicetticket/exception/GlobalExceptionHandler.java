package com.smartcampus.maintainInsicetticket.exception;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleError(Exception ex) {
        log.error("Global exception handler caught: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFound(NoResourceFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                "RESOURCE_NOT_FOUND",
                "The requested resource was not found. Available endpoints:\n" +
                "GET /api/dashboard - Combined dashboard data\n" +
                "GET /api/dashboard/tickets - All tickets\n" +
                "GET /api/dashboard/tickets/{id} - Ticket by ID\n" +
                "GET /api/dashboard/tickets/{id}/status - Ticket status\n" +
                "POST /api/dashboard/tickets - Create ticket\n" +
                "PUT /api/dashboard/tickets/{id} - Update ticket\n" +
                "PATCH /api/dashboard/tickets/{id}/status - Update ticket status\n" +
                "DELETE /api/dashboard/tickets/{id} - Delete ticket\n" +
                "GET /api/dashboard/dashboard/stats - Dashboard statistics\n" +
                "GET /api/dashboard/tickets/status/{status} - Filter by status\n" +
                "GET /api/dashboard/tickets/priority/{priority} - Filter by priority\n" +
                "GET /dashboard - Combined dashboard data\n" +
                "GET /health - Application health check",
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        log.error("Illegal argument exception: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                "BAD_REQUEST",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleJsonParsingErrors(HttpMessageNotReadableException ex) {
        log.error("JSON parsing error: {}", ex.getMessage(), ex);
        String errorMessage = "Invalid JSON format. ";
        
        if (ex.getCause() instanceof InvalidFormatException) {
            errorMessage += "Date/time must be in format: yyyy-MM-dd'T'HH:mm:ss";
        } else if (ex.getCause() instanceof JsonMappingException) {
            errorMessage += "Invalid field values or format.";
        } else {
            errorMessage += ex.getMessage();
        }
        
        ErrorResponse error = new ErrorResponse(
                "JSON_PARSE_ERROR",
                errorMessage,
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        log.error("Runtime exception: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                "RUNTIME_ERROR",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ErrorResponse> handleNullPointer(NullPointerException ex) {
        log.error("Null pointer exception: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                "NULL_POINTER_ERROR",
                "A null value was encountered. Please check the request parameters.",
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @Data
    public static class ErrorResponse {
        private String error;
        private String message;
        private LocalDateTime timestamp;

        public ErrorResponse(String error, String message, LocalDateTime timestamp) {
            this.error = error;
            this.message = message;
            this.timestamp = timestamp;
        }
    }
}

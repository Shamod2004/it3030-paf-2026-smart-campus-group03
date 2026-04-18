package com.smartcampus.controller;

import com.smartcampus.dto.BookingDTO;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            BookingDTO created = bookingService.createBooking(bookingDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (BookingConflictException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable String email) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(email));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            BookingStatus status = BookingStatus.valueOf(body.get("status"));
            String reason = body.getOrDefault("rejectionReason", null);
            BookingDTO updated = bookingService.updateStatus(id, status, reason);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", "Invalid status value"), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            BookingDTO updated = bookingService.cancelBooking(id);
            return ResponseEntity.ok(updated);
        } catch (BookingConflictException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}

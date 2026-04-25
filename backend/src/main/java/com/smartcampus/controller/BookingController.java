package com.smartcampus.controller;

import com.smartcampus.dto.BookingDTO;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired private BookingService  bookingService;
    @Autowired private UserRepository  userRepository;

    private User resolveUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }

    // ── USER: Create a booking request ────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = resolveUser(userDetails);
            BookingDTO created = bookingService.createBooking(dto, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (BookingConflictException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ── ADMIN: Get all bookings ───────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ── USER: Get own bookings ────────────────────────────────────────────────

    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(bookingService.getBookingsByUser(user));
    }

    // ── USER: Get booking by ID ───────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ── ADMIN/MANAGER: Approve or reject ─────────────────────────────────────

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            BookingStatus status = BookingStatus.valueOf(body.get("status").toUpperCase());
            String reason = body.getOrDefault("reason", null);
            User admin = resolveUser(userDetails);
            return ResponseEntity.ok(bookingService.updateStatus(id, status, reason, admin));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ── USER/ADMIN: Cancel a booking ──────────────────────────────────────────

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = resolveUser(userDetails);
            return ResponseEntity.ok(bookingService.cancelBooking(id, user));
        } catch (BookingConflictException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

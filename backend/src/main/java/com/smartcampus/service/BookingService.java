package com.smartcampus.service;

import com.smartcampus.dto.BookingDTO;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.User;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.resources.model.Resource;
import com.smartcampus.resources.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired private BookingRepository   bookingRepository;
    @Autowired private UserRepository      userRepository;
    @Autowired private ResourceRepository  resourceRepository;
    @Autowired private NotificationService notificationService;

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingDTO createBooking(BookingDTO dto, User requestingUser) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + dto.getResourceId()));

        // Conflict check
        if (hasConflict(resource.getId(), dto)) {
            throw new BookingConflictException(
                    "Booking conflict: " + resource.getName() + " is already booked for that time slot.");
        }

        Booking booking = new Booking();
        booking.setUser(requestingUser);
        booking.setResource(resource);
        booking.setResourceName(resource.getName());
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setAttendees(dto.getAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Notify admins about new booking request
        userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("ADMIN"))
                .forEach(admin -> notificationService.sendNotification(
                        admin.getId(),
                        requestingUser.getName() + " requested booking for " + resource.getName()
                                + " on " + dto.getDate(),
                        "BOOKING_PENDING",
                        saved.getId().toString(),
                        "BOOKING",
                        requestingUser.getName()
                ));

        return toDTO(saved);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByUser(User user) {
        return bookingRepository.findByUser(user).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {
        return toDTO(bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id)));
    }

    // ── Status update (Admin/Manager) ─────────────────────────────────────────

    @Transactional
    public BookingDTO updateStatus(Long id, BookingStatus status, String reason, User admin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        booking.setStatus(status);
        if (status == BookingStatus.REJECTED) {
            booking.setAdminReason(reason);
        } else {
            booking.setAdminReason(null);
        }
        Booking saved = bookingRepository.save(booking);

        // Notify the booking owner
        String notifType = status == BookingStatus.APPROVED ? "BOOKING_APPROVED" : "BOOKING_REJECTED";
        String message = "Your booking for " + booking.getResourceName() + " on " + booking.getDate()
                + " has been " + status.name().toLowerCase();
        if (status == BookingStatus.REJECTED && reason != null) {
            message += ". Reason: " + reason;
        }
        notificationService.sendNotification(
                booking.getUser().getId(), message, notifType,
                saved.getId().toString(), "BOOKING",
                admin != null ? admin.getName() : "Admin"
        );

        return toDTO(saved);
    }

    // ── Cancel (User) ─────────────────────────────────────────────────────────

    @Transactional
    public BookingDTO cancelBooking(Long id, User requestingUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        // Only the owner or admin can cancel
        boolean isOwner = booking.getUser().getId().equals(requestingUser.getId());
        boolean isAdmin = requestingUser.getRole().name().equals("ADMIN");
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Not authorised to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingConflictException("Booking is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toDTO(bookingRepository.save(booking));
    }

    // ── Conflict check ────────────────────────────────────────────────────────

    private boolean hasConflict(Long resourceId, BookingDTO dto) {
        List<Booking> existing = bookingRepository
                .findActiveBookingsByResourceAndDate(resourceId, dto.getDate());
        LocalTime reqStart = dto.getStartTime();
        LocalTime reqEnd   = dto.getEndTime();
        for (Booking b : existing) {
            if (reqStart.isBefore(b.getEndTime()) && reqEnd.isAfter(b.getStartTime())) {
                return true;
            }
        }
        return false;
    }

    // ── DTO conversion ────────────────────────────────────────────────────────

    private BookingDTO toDTO(Booking b) {
        BookingDTO dto = new BookingDTO();
        dto.setId(b.getId());
        dto.setUserId(b.getUser().getId());
        dto.setUserName(b.getUser().getName());
        if (b.getResource() != null) dto.setResourceId(b.getResource().getId());
        dto.setResourceName(b.getResourceName());
        dto.setDate(b.getDate());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setPurpose(b.getPurpose());
        dto.setAttendees(b.getAttendees());
        dto.setStatus(b.getStatus());
        dto.setAdminReason(b.getAdminReason());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }
}

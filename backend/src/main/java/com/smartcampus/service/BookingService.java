package com.smartcampus.service;

import com.smartcampus.dto.BookingDTO;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    private BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setResourceName(booking.getResourceName());
        dto.setUserEmail(booking.getUserEmail());
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendees(booking.getAttendees());
        dto.setStatus(booking.getStatus());
        dto.setAdminReason(booking.getAdminReason());
        return dto;
    }

    public BookingDTO createBooking(BookingDTO bookingDTO) {
        // Check for time conflict
        if (checkConflict(bookingDTO.getResourceName(), bookingDTO.getDate(), bookingDTO.getStartTime(),
                bookingDTO.getEndTime())) {
            throw new BookingConflictException("Booking time conflict for resource on this date.");
        }
        Booking booking = new Booking();
        booking.setResourceName(bookingDTO.getResourceName());
        booking.setUserEmail(bookingDTO.getUserEmail());
        booking.setDate(bookingDTO.getDate());
        booking.setStartTime(bookingDTO.getStartTime());
        booking.setEndTime(bookingDTO.getEndTime());
        booking.setPurpose(bookingDTO.getPurpose());
        booking.setAttendees(bookingDTO.getAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setAdminReason(null);
        Booking saved = bookingRepository.save(booking);
        return toDTO(saved);
    }

    public boolean checkConflict(String resourceName, java.time.LocalDate date, LocalTime start, LocalTime end) {
        List<Booking> bookings = bookingRepository.findByResourceNameAndDate(resourceName, date);
        for (Booking b : bookings) {
            if (b.getStatus() == BookingStatus.CANCELLED || b.getStatus() == BookingStatus.REJECTED)
                continue;
            if (start.isBefore(b.getEndTime()) && end.isAfter(b.getStartTime())) {
                return true;
            }
        }
        return false;
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByUser(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BookingDTO updateStatus(Long id, BookingStatus status, String reason) {
        Optional<Booking> opt = bookingRepository.findById(id);
        if (!opt.isPresent())
            throw new RuntimeException("Booking not found");
        Booking booking = opt.get();
        if (status == BookingStatus.REJECTED) {
            booking.setStatus(BookingStatus.REJECTED);
            booking.setAdminReason(reason);
        } else if (status == BookingStatus.APPROVED) {
            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminReason(null);
        }
        Booking saved = bookingRepository.save(booking);
        return toDTO(saved);
    }

    public BookingDTO cancelBooking(Long id) {
        Optional<Booking> opt = bookingRepository.findById(id);
        if (!opt.isPresent())
            throw new RuntimeException("Booking not found");
        Booking booking = opt.get();
        if (booking.getStatus() == BookingStatus.APPROVED) {
            booking.setStatus(BookingStatus.CANCELLED);
            Booking saved = bookingRepository.save(booking);
            return toDTO(saved);
        } else {
            throw new BookingConflictException("Only approved bookings can be cancelled.");
        }
    }
}

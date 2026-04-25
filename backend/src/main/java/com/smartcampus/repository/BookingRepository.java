package com.smartcampus.repository;

import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // All bookings for a specific user
    List<Booking> findByUser(User user);

    // All bookings for a resource on a date (for conflict detection)
    List<Booking> findByResourceNameAndDate(String resourceName, LocalDate date);

    // All bookings for a resource by ID on a date
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.date = :date " +
           "AND b.status NOT IN ('CANCELLED', 'REJECTED')")
    List<Booking> findActiveBookingsByResourceAndDate(
            @Param("resourceId") Long resourceId,
            @Param("date") LocalDate date);

    // All bookings by status
    List<Booking> findByStatus(BookingStatus status);
}

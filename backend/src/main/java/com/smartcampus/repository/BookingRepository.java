package com.smartcampus.repository;

import com.smartcampus.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);

    List<Booking> findByResourceNameAndDate(String resourceName, LocalDate date);
}

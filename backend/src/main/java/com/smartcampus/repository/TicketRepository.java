package com.smartcampus.repository;

import com.smartcampus.model.Ticket;
import com.smartcampus.model.User;
import com.smartcampus.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreator(User creator);
    List<Ticket> findByTechnician(User technician);
    List<Ticket> findByStatus(TicketStatus status);
}

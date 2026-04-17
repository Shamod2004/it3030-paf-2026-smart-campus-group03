package com.smartcampus.maintainInsicetticket.repository;

import com.smartcampus.maintainInsicetticket.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    List<Ticket> findByStatus(Ticket.Status status);
    
    List<Ticket> findByPriority(Ticket.Priority priority);
    
    List<Ticket> findByCategory(String category);
    
    List<Ticket> findByAssignedTechnician(String technician);
    
    List<Ticket> findBySubmittedBy(String submittedBy);
    
    Optional<Ticket> findByTicketId(String ticketId);
    
    boolean existsByTicketId(String ticketId);
    
    @Query("SELECT t FROM Ticket t ORDER BY t.createdDate DESC")
    List<Ticket> findAllOrderByCreatedDateDesc();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = :status")
    long countByStatus(@Param("status") Ticket.Status status);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priority = :priority")
    long countByPriority(@Param("priority") Ticket.Priority priority);
}

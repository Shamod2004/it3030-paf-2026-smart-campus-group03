package com.smartcampus.maintainInsicetticket.service;

import com.smartcampus.maintainInsicetticket.model.Ticket;
import com.smartcampus.maintainInsicetticket.repository.TicketRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final AtomicLong ticketCounter = new AtomicLong(2000);

    @PostConstruct
    public void initCounter() {
        ticketRepository.findAll().stream()
            .map(t -> t.getTicketId())
            .filter(id -> id != null && id.startsWith("INC-"))
            .mapToLong(id -> {
                try { return Long.parseLong(id.replace("INC-", "")); } catch (Exception e) { return 0L; }
            })
            .max()
            .ifPresent(max -> ticketCounter.set(max));
    }
    
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllOrderByCreatedDateDesc();
    }
    
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }
    
    public Optional<Ticket> getTicketByTicketId(String ticketId) {
        return ticketRepository.findByTicketId(ticketId);
    }
    
    public Ticket createTicket(Ticket ticket) {
        if (ticket.getTicketId() == null || ticket.getTicketId().isEmpty()) {
            ticket.setTicketId(generateUniqueTicketId());
        }
        ticket.setCreatedDate(LocalDateTime.now());
        ticket.setUpdatedDate(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
    
    public Ticket updateTicket(Long id, Ticket ticketDetails) {
        Optional<Ticket> ticketOptional = ticketRepository.findById(id);
        if (ticketOptional.isPresent()) {
            Ticket ticket = ticketOptional.get();
            
            // Only update fields that are not null in the request
            if (ticketDetails.getTitle() != null) {
                ticket.setTitle(ticketDetails.getTitle());
            }
            if (ticketDetails.getCategory() != null) {
                ticket.setCategory(ticketDetails.getCategory());
            }
            if (ticketDetails.getPriority() != null) {
                ticket.setPriority(ticketDetails.getPriority());
            }
            if (ticketDetails.getStatus() != null) {
                ticket.setStatus(ticketDetails.getStatus());
            }
            if (ticketDetails.getAssignedTechnician() != null) {
                ticket.setAssignedTechnician(ticketDetails.getAssignedTechnician());
            }
            if (ticketDetails.getDescription() != null) {
                ticket.setDescription(ticketDetails.getDescription());
            }
            
            ticket.setUpdatedDate(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
    
    public Ticket updateTicketStatus(Long id, java.util.Map<String, String> body) {
        Optional<Ticket> ticketOptional = ticketRepository.findById(id);
        if (ticketOptional.isPresent()) {
            Ticket ticket = ticketOptional.get();
            if (body.containsKey("status")) {
                ticket.setStatus(Ticket.Status.valueOf(body.get("status").toUpperCase()));
            }
            if (body.containsKey("assignedTechnician")) {
                ticket.setAssignedTechnician(body.get("assignedTechnician"));
            }
            if (body.containsKey("rejectReason")) {
                ticket.setRejectReason(body.get("rejectReason"));
            }
            if (body.containsKey("resolutionNotes")) {
                ticket.setResolutionNotes(body.get("resolutionNotes"));
            }
            ticket.setUpdatedDate(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }

    /**
     * Delete a ticket permanently from the database
     * @param id the ticket ID
     * @throws RuntimeException if ticket not found
     */
    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        ticketRepository.deleteById(id);
    }
    
    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(Ticket.Status.valueOf(status.toUpperCase()));
    }
    
    public List<Ticket> getTicketsByPriority(String priority) {
        return ticketRepository.findByPriority(Ticket.Priority.valueOf(priority.toUpperCase()));
    }
    
    public DashboardStats getDashboardStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(Ticket.Status.OPEN);
        long inProgress = ticketRepository.countByStatus(Ticket.Status.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(Ticket.Status.RESOLVED);
        long rejected = ticketRepository.countByStatus(Ticket.Status.REJECTED);
        
        return new DashboardStats(total, open, inProgress, resolved, rejected);
    }
    
    
    private String generateUniqueTicketId() {
        String id;
        do {
            id = "INC-" + ticketCounter.incrementAndGet();
        } while (ticketRepository.existsByTicketId(id));
        return id;
    }
    
    public static class DashboardStats {
        private final long total;
        private final long open;
        private final long inProgress;
        private final long resolved;
        private final long rejected;
        
        public DashboardStats(long total, long open, long inProgress, long resolved, long rejected) {
            this.total = total;
            this.open = open;
            this.inProgress = inProgress;
            this.resolved = resolved;
            this.rejected = rejected;
        }
        
        public long getTotal() { return total; }
        public long getOpen() { return open; }
        public long getInProgress() { return inProgress; }
        public long getResolved() { return resolved; }
        public long getRejected() { return rejected; }
    }
}

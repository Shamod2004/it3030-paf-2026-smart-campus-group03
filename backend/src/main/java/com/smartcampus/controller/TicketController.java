package com.smartcampus.controller;

import com.smartcampus.dto.request.TicketRequest;
import com.smartcampus.enums.TicketStatus;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.TicketService;
import com.smartcampus.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.ok(ticketService.getAllTickets());
        } else if (user.getRole().name().equals("TECHNICIAN")) {
            return ResponseEntity.ok(ticketService.getTicketsByTechnician(user.getId()));
        } else {
            return ResponseEntity.ok(ticketService.getTicketsByCreator(user.getId()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Ticket> createTicket(
            @AuthenticationPrincipal UserDetails userDetails, 
            @RequestPart("ticket") TicketRequest request,
            @RequestPart(value="files", required=false) List<MultipartFile> files) {
        
        User user = getCurrentUser(userDetails);
        
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        
        return ResponseEntity.ok(ticketService.createTicketWithFiles(ticket, files, user));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        
        TicketStatus status;
        try {
            status = TicketStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid status value: " + request.getStatus());
        }
        
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, request.getNotes(), user));
    }

    public static class StatusUpdateRequest {
        private String status;
        private String notes;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long technicianId = body.get("technicianId");
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<User>> getTechnicians() {
        return ResponseEntity.ok(userRepository.findByRole(com.smartcampus.enums.Role.TECHNICIAN));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        String content = body.get("content");
        return ResponseEntity.ok(ticketService.addComment(id, content, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok().build();
    }
}

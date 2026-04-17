package com.smartcampus.maintainInsicetticket.controller;

import com.smartcampus.maintainInsicetticket.model.Ticket;
import com.smartcampus.maintainInsicetticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:55747"}, methods = {org.springframework.web.bind.annotation.RequestMethod.GET, org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.PATCH, org.springframework.web.bind.annotation.RequestMethod.DELETE, org.springframework.web.bind.annotation.RequestMethod.OPTIONS})
public class DashboardController {
    
    private final TicketService ticketService;
    
    @GetMapping("/tickets")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            log.error("Error fetching tickets: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/tickets/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable("id") Long id) {
        try {
            Optional<Ticket> ticket = ticketService.getTicketById(id);
            return ticket.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching ticket by id: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("")
    public ResponseEntity<?> getDashboardRoot() {
        try {
            log.debug("GET /api/dashboard endpoint called");
            
            // Get dashboard stats
            TicketService.DashboardStats stats = ticketService.getDashboardStats();
            
            // Get all tickets
            var tickets = ticketService.getAllTickets();
            
            // Create combined response
            Map<String, Object> response = new HashMap<>();
            response.put("stats", stats);
            response.put("tickets", tickets);
            response.put("message", "Dashboard data loaded successfully");
            
            log.debug("Dashboard data prepared: {} tickets, stats: {}", tickets.size(), stats);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching dashboard data: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal Server Error");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now().toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<TicketService.DashboardStats> getDashboardStats() {
        try {
            TicketService.DashboardStats stats = ticketService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/tickets")
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        try {
            Ticket createdTicket = ticketService.createTicket(ticket);
            return ResponseEntity.ok(createdTicket);
        } catch (Exception e) {
            log.error("Error creating ticket: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/tickets/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable("id") Long id, @Valid @RequestBody Ticket ticket) {
        try {
            log.debug("Updating ticket {} with data: {}", id, ticket);
            Ticket updatedTicket = ticketService.updateTicket(id, ticket);
            if (updatedTicket != null) {
                log.debug("Ticket updated successfully: {}", updatedTicket);
                return ResponseEntity.ok(updatedTicket);
            }
            log.warn("Ticket not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument for ticket update: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error updating ticket: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/tickets/{id}/status")
    public ResponseEntity<String> getTicketStatus(@PathVariable("id") Long id) {
        try {
            Optional<Ticket> ticket = ticketService.getTicketById(id);
            if (ticket.isPresent()) {
                return ResponseEntity.ok(ticket.get().getStatus().toString());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        } catch (Exception e) {
            log.error("Error fetching ticket status: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching ticket status");
        }
    }
    
    @PatchMapping("/tickets/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable("id") Long id, @RequestBody java.util.Map<String, String> body) {
        try {
            Ticket updated = ticketService.updateTicketStatus(id, body);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating ticket status: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable("id") Long id) {
        try {
            ticketService.deleteTicket(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ticket deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Ticket not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Ticket not found");
            }
            log.error("Error deleting ticket: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/tickets/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable("status") String status) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByStatus(status);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            log.error("Error fetching tickets by status: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/tickets/priority/{priority}")
    public ResponseEntity<List<Ticket>> getTicketsByPriority(@PathVariable("priority") String priority) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByPriority(priority);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            log.error("Error fetching tickets by priority: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Catch-all handler for unmatched requests within /api/dashboard/*
    @GetMapping("/**")
    public ResponseEntity<?> handleUnmatchedGetRequests(HttpServletRequest request) {
        String path = request.getRequestURI();
        log.warn("Unmatched GET request to: {}", path);
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "ENDPOINT_NOT_FOUND");
        error.put("message", "The requested endpoint does not exist: " + path);
        error.put("availableEndpoints", getAvailableEndpoints());
        error.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    // Catch-all handler for unmatched POST/PUT/PATCH/DELETE requests
    @RequestMapping(value = "/**", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
    public ResponseEntity<?> handleUnmatchedOtherRequests(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        log.warn("Unmatched {} request to: {}", method, path);
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "ENDPOINT_NOT_FOUND");
        error.put("message", "The requested endpoint does not exist: " + method + " " + path);
        error.put("availableEndpoints", getAvailableEndpoints());
        error.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    private String getAvailableEndpoints() {
        return "Available endpoints:\n" +
               "GET /api/dashboard - Combined dashboard data\n" +
               "GET /api/dashboard/tickets - All tickets\n" +
               "GET /api/dashboard/tickets/{id} - Ticket by ID\n" +
               "GET /api/dashboard/tickets/{id}/status - Ticket status\n" +
               "POST /api/dashboard/tickets - Create ticket\n" +
               "PUT /api/dashboard/tickets/{id} - Update ticket\n" +
               "PATCH /api/dashboard/tickets/{id}/status - Update ticket status\n" +
               "DELETE /api/dashboard/tickets/{id} - Delete ticket\n" +
               "GET /api/dashboard/dashboard/stats - Dashboard statistics\n" +
               "GET /api/dashboard/tickets/status/{status} - Filter by status\n" +
               "GET /api/dashboard/tickets/priority/{priority} - Filter by priority";
    }
}

package com.smartcampus.maintainInsicetticket.controller;

import com.smartcampus.maintainInsicetticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:55747"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class RootController {

    private final TicketService ticketService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        try {
            log.debug("Root /dashboard endpoint called");
            
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
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("application", "MaintainInsicetTicket");
        return ResponseEntity.ok(response);
    }
}

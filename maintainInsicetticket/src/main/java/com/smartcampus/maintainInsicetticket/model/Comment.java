package com.smartcampus.maintainInsicetticket.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    private Long id;
    private String user;
    private String role;
    private String message;
    private String timestamp;
    private Long ticketId;
    private boolean edited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Comment(Long id, String user, String role, String message, Long ticketId) {
        this.id = id;
        this.user = user;
        this.role = role;
        this.message = message;
        this.ticketId = ticketId;
        this.timestamp = LocalDateTime.now().toString();
        this.edited = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}

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
public class Attachment {
    private Long id;
    private String name;
    private String type;
    private String url;
    private Long size;
    private Long ticketId;
    private LocalDateTime uploadedAt;
    private String uploadedBy;
    
    public Attachment(String name, String type, String url, Long size, Long ticketId) {
        this.name = name;
        this.type = type;
        this.url = url;
        this.size = size;
        this.ticketId = ticketId;
        this.uploadedAt = LocalDateTime.now();
        this.uploadedBy = "System User"; // This could be dynamic based on authentication
    }
}

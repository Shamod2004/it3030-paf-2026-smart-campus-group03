package com.smartcampus.maintainInsicetticket.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tickets")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ticket_id", unique = true, nullable = false, length = 50)
    private String ticketId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "category", nullable = false, length = 100)
    private String category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;
    
    @Column(name = "submitted_by", nullable = false)
    private String submittedBy;
    
    @Column(name = "assigned_technician")
    private String assignedTechnician;
    
    @Column(name = "created_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedDate;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
    
    public enum Status {
        OPEN, IN_PROGRESS, RESOLVED, REJECTED
    }
    
    public Ticket(String ticketId, String title, String category, String priority, String status, 
                  String submittedBy, String assignedTechnician, String description) {
        this.ticketId = ticketId;
        this.title = title;
        this.category = category;
        this.priority = Priority.valueOf(priority.toUpperCase());
        this.status = Status.valueOf(status.toUpperCase());
        this.submittedBy = submittedBy;
        this.assignedTechnician = assignedTechnician;
        this.description = description;
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
        if (updatedDate == null) {
            updatedDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
    
    public void updateStatus(String newStatus) {
        this.status = Status.valueOf(newStatus.toUpperCase());
        this.updatedDate = LocalDateTime.now();
    }
    
    public void assignTechnician(String technician) {
        this.assignedTechnician = technician;
        this.updatedDate = LocalDateTime.now();
    }
}

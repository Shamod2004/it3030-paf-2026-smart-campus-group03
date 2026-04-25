package com.smartcampus.resources.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources", indexes = {
        @Index(name = "idx_resource_id", columnList = "resource_id"),
        @Index(name = "idx_name", columnList = "name"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_location", columnList = "location")
})
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_id", unique = true, nullable = false)
    private String resourceId;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type = ResourceType.ROOM;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status = ResourceStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Column(name = "total_bookings")
    private Long totalBookings = 0L;

    // Availability windows e.g. "Mon-Fri 08:00-18:00"
    @Column(name = "availability_windows")
    private String availabilityWindows;

    public Resource() {}

    public Resource(String resourceId, String name, ResourceType type, Integer capacity,
                   String location, String description, String imageUrl, ResourceStatus status) {
        this.resourceId = resourceId;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        totalBookings = 0L;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Explicit getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(LocalDateTime lastUsedAt) { this.lastUsedAt = lastUsedAt; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public String getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(String availabilityWindows) { this.availabilityWindows = availabilityWindows; }
}

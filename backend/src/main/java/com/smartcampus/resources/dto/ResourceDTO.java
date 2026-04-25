package com.smartcampus.resources.dto;

import com.smartcampus.resources.model.ResourceStatus;
import com.smartcampus.resources.model.ResourceType;

import java.time.LocalDateTime;

public class ResourceDTO {
    private Long id;
    private String resourceId;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String description;
    private String imageUrl;
    private ResourceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastUsedAt;
    private Long totalBookings;
    private String availabilityWindows;

    public ResourceDTO() {}

    public ResourceDTO(Long id, String resourceId, String name, ResourceType type, Integer capacity,
                      String location, String description, String imageUrl, ResourceStatus status,
                      LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime lastUsedAt,
                      Long totalBookings) {
        this.id = id;
        this.resourceId = resourceId;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastUsedAt = lastUsedAt;
        this.totalBookings = totalBookings;
    }

    // Getters and Setters
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

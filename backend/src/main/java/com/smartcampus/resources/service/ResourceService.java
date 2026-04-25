package com.smartcampus.resources.service;

import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.resources.dto.CreateResourceRequest;
import com.smartcampus.resources.dto.ResourceDTO;
import com.smartcampus.resources.model.Resource;
import com.smartcampus.resources.model.ResourceStatus;
import com.smartcampus.resources.model.ResourceType;
import com.smartcampus.resources.repository.ResourceRepository;
import com.smartcampus.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository  resourceRepository;
    private final NotificationService notificationService;
    private final UserRepository      userRepository;

    public ResourceService(ResourceRepository resourceRepository,
                           NotificationService notificationService,
                           UserRepository userRepository) {
        this.resourceRepository  = resourceRepository;
        this.notificationService = notificationService;
        this.userRepository      = userRepository;
    }

    // ── Read operations ──────────────────────────────────────────────────────

    public Page<ResourceDTO> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable).map(this::convertToDTO);
    }

    public ResourceDTO getResourceById(Long id) {
        return convertToDTO(resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id)));
    }

    public ResourceDTO getResourceByResourceId(String resourceId) {
        return convertToDTO(resourceRepository.findByResourceId(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with resourceId: " + resourceId)));
    }

    public Page<ResourceDTO> searchResources(String searchTerm, Pageable pageable) {
        return resourceRepository.searchResources(searchTerm, pageable).map(this::convertToDTO);
    }

    public Page<ResourceDTO> getResourcesWithFilters(String type, String status, String location,
                                                     Integer minCapacity, Integer maxCapacity,
                                                     Pageable pageable) {
        ResourceType   resourceType   = type   != null ? ResourceType.valueOf(type)     : null;
        ResourceStatus resourceStatus = status != null ? ResourceStatus.valueOf(status) : null;
        return resourceRepository
                .findWithFilters(resourceType, resourceStatus, location, minCapacity, maxCapacity, pageable)
                .map(this::convertToDTO);
    }

    // ── Write operations ─────────────────────────────────────────────────────

    /**
     * Create a new resource.
     * Fires a RESOURCE_CREATED notification to ALL users.
     *
     * @param request  resource data
     * @param adminUser the authenticated admin performing the action
     */
    public ResourceDTO createResource(CreateResourceRequest request, User adminUser) {
        if (resourceRepository.existsByResourceId(request.getResourceId())) {
            throw new RuntimeException("Resource ID already exists: " + request.getResourceId());
        }

        Resource resource = new Resource();
        resource.setResourceId(request.getResourceId());
        resource.setName(request.getName());
        resource.setType(ResourceType.valueOf(request.getType()));
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        resource.setStatus(ResourceStatus.valueOf(request.getStatus()));

        Resource saved = resourceRepository.save(resource);

        // Notify all users about the new resource
        String adminName = adminUser != null ? adminUser.getName() : "Admin";
        notificationService.notifyAllUsers(
                "New resource available: " + saved.getName() + " at " + saved.getLocation(),
                "RESOURCE_CREATED",
                String.valueOf(saved.getId()),
                "RESOURCE",
                adminName
        );

        return convertToDTO(saved);
    }

    /**
     * Update resource details.
     * No broadcast notification — only status changes trigger notifications.
     */
    public ResourceDTO updateResource(Long id, CreateResourceRequest request, User adminUser) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));

        resource.setName(request.getName());
        resource.setType(ResourceType.valueOf(request.getType()));
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        resource.setStatus(ResourceStatus.valueOf(request.getStatus()));

        return convertToDTO(resourceRepository.save(resource));
    }

    /**
     * Delete a resource.
     */
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with ID: " + id);
        }
        resourceRepository.deleteById(id);
    }

    /**
     * Update resource status.
     * Fires a RESOURCE_STATUS_CHANGED notification to ALL users when status changes.
     *
     * @param id        resource DB id
     * @param status    new status string (e.g. "OUT_OF_SERVICE", "ACTIVE")
     * @param adminUser the authenticated admin performing the action
     */
    public ResourceDTO updateResourceStatus(Long id, String status, User adminUser) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));

        ResourceStatus oldStatus = resource.getStatus();
        ResourceStatus newStatus = ResourceStatus.valueOf(status);

        resource.setStatus(newStatus);
        Resource updated = resourceRepository.save(resource);

        // Only notify if status actually changed
        if (!oldStatus.equals(newStatus)) {
            String adminName = adminUser != null ? adminUser.getName() : "Admin";
            String message = "Resource \"" + updated.getName() + "\" status changed from "
                    + oldStatus.name() + " to " + newStatus.name();
            notificationService.notifyAllUsers(
                    message,
                    "RESOURCE_STATUS_CHANGED",
                    String.valueOf(updated.getId()),
                    "RESOURCE",
                    adminName
            );
        }

        return convertToDTO(updated);
    }

    // ── Lookup helpers ────────────────────────────────────────────────────────

    public List<String> getAllResourceTypes() {
        return List.of(
                ResourceType.ROOM.name(),
                ResourceType.LAB.name(),
                ResourceType.EQUIPMENT.name(),
                ResourceType.FACILITY.name()
        );
    }

    public List<String> getAllResourceStatuses() {
        return List.of(
                ResourceStatus.ACTIVE.name(),
                ResourceStatus.MAINTENANCE.name(),
                ResourceStatus.OUT_OF_SERVICE.name(),
                ResourceStatus.INACTIVE.name()
        );
    }

    // ── DTO conversion ────────────────────────────────────────────────────────

    private ResourceDTO convertToDTO(Resource resource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setResourceId(resource.getResourceId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setDescription(resource.getDescription());
        dto.setImageUrl(resource.getImageUrl());
        dto.setStatus(resource.getStatus());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setUpdatedAt(resource.getUpdatedAt());
        dto.setLastUsedAt(resource.getLastUsedAt());
        dto.setTotalBookings(resource.getTotalBookings());
        return dto;
    }
}

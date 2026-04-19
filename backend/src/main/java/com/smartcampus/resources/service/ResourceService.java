package com.smartcampus.resources.service;

import com.smartcampus.resources.dto.CreateResourceRequest;
import com.smartcampus.resources.dto.ResourceDTO;
import com.smartcampus.resources.model.Resource;
import com.smartcampus.resources.model.ResourceStatus;
import com.smartcampus.resources.model.ResourceType;
import com.smartcampus.resources.repository.ResourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // Get all resources with pagination
    public Page<ResourceDTO> getAllResources(Pageable pageable) {
        Page<Resource> resources = resourceRepository.findAll(pageable);
        return resources.map(this::convertToDTO);
    }

    // Get resource by ID
    public ResourceDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));
        return convertToDTO(resource);
    }

    // Get resource by resource ID (custom field)
    public ResourceDTO getResourceByResourceId(String resourceId) {
        Resource resource = resourceRepository.findByResourceId(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with resourceId: " + resourceId));
        return convertToDTO(resource);
    }

    // Search resources
    public Page<ResourceDTO> searchResources(String searchTerm, Pageable pageable) {
        Page<Resource> resources = resourceRepository.searchResources(searchTerm, pageable);
        return resources.map(this::convertToDTO);
    }

    // Filter resources with multiple criteria
    public Page<ResourceDTO> getResourcesWithFilters(
            String type,
            String status,
            String location,
            Integer minCapacity,
            Integer maxCapacity,
            Pageable pageable) {
        
        ResourceType resourceType = type != null ? ResourceType.valueOf(type) : null;
        ResourceStatus resourceStatus = status != null ? ResourceStatus.valueOf(status) : null;

        Page<Resource> resources = resourceRepository.findWithFilters(
                resourceType,
                resourceStatus,
                location,
                minCapacity,
                maxCapacity,
                pageable
        );
        return resources.map(this::convertToDTO);
    }

    // Create new resource
    public ResourceDTO createResource(CreateResourceRequest request) {
        // Check if resource ID already exists
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

        Resource savedResource = resourceRepository.save(resource);
        return convertToDTO(savedResource);
    }

    // Update resource
    public ResourceDTO updateResource(Long id, CreateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));

        resource.setName(request.getName());
        resource.setType(ResourceType.valueOf(request.getType()));
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        resource.setStatus(ResourceStatus.valueOf(request.getStatus()));

        Resource updatedResource = resourceRepository.save(resource);
        return convertToDTO(updatedResource);
    }

    // Delete resource
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with ID: " + id);
        }

        resourceRepository.deleteById(id);
    }

    // Update resource status
    public ResourceDTO updateResourceStatus(Long id, String status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));

        resource.setStatus(ResourceStatus.valueOf(status));
        Resource updatedResource = resourceRepository.save(resource);
        return convertToDTO(updatedResource);
    }

    // Get all resource types
    public List<String> getAllResourceTypes() {
        return List.of(
                ResourceType.ROOM.name(),
                ResourceType.LAB.name(),
                ResourceType.EQUIPMENT.name(),
                ResourceType.FACILITY.name()
        );
    }

    // Get all resource statuses
    public List<String> getAllResourceStatuses() {
        return List.of(
                ResourceStatus.ACTIVE.name(),
                ResourceStatus.MAINTENANCE.name(),
                ResourceStatus.INACTIVE.name()
        );
    }

    // Helper method to convert Resource to DTO
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

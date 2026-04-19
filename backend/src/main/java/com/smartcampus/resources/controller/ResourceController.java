package com.smartcampus.resources.controller;

import com.smartcampus.resources.dto.CreateResourceRequest;
import com.smartcampus.resources.dto.ResourceDTO;
import com.smartcampus.resources.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    /**
     * Get all resources with pagination
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        try {
            Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<ResourceDTO> resources = resourceService.getAllResources(pageable);
            
            Map<String, Object> response = buildPaginatedResponse(resources);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to fetch resources"));
        }
    }

    /**
     * Search resources by name, resourceId, or location
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResources(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ResourceDTO> resources = resourceService.searchResources(searchTerm, pageable);
            
            Map<String, Object> response = buildPaginatedResponse(resources);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to search resources"));
        }
    }

    /**
     * Filter resources by type, status, location, and capacity
     */
    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ResourceDTO> resources = resourceService.getResourcesWithFilters(
                    type, status, location, minCapacity, maxCapacity, pageable);
            
            Map<String, Object> response = buildPaginatedResponse(resources);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to filter resources"));
        }
    }

    /**
     * Get resource by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getResourceById(@PathVariable Long id) {
        try {
            ResourceDTO resource = resourceService.getResourceById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", resource);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildErrorResponse("Resource not found"));
        }
    }

    /**
     * Get resource by resourceId (custom field)
     */
    @GetMapping("/by-resource-id/{resourceId}")
    public ResponseEntity<Map<String, Object>> getResourceByResourceId(@PathVariable String resourceId) {
        try {
            ResourceDTO resource = resourceService.getResourceByResourceId(resourceId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", resource);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildErrorResponse("Resource not found"));
        }
    }

    /**
     * Create new resource
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createResource(@RequestBody CreateResourceRequest request) {
        try {
            ResourceDTO resource = resourceService.createResource(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resource created successfully");
            response.put("data", resource);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(buildErrorResponse("Failed to create resource: " + e.getMessage()));
        }
    }

    /**
     * Update resource
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateResource(
            @PathVariable Long id,
            @RequestBody CreateResourceRequest request) {
        try {
            ResourceDTO resource = resourceService.updateResource(id, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resource updated successfully");
            response.put("data", resource);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(buildErrorResponse("Failed to update resource"));
        }
    }

    /**
     * Delete resource
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id) {
        try {
            resourceService.deleteResource(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resource deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildErrorResponse("Failed to delete resource"));
        }
    }

    /**
     * Update resource status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateResourceStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            ResourceDTO resource = resourceService.updateResourceStatus(id, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resource status updated");
            response.put("data", resource);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(buildErrorResponse("Failed to update resource status"));
        }
    }

    /**
     * Get all resource types
     */
    @GetMapping("/types/all")
    public ResponseEntity<Map<String, Object>> getAllResourceTypes() {
        try {
            List<String> types = resourceService.getAllResourceTypes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", types);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to fetch resource types"));
        }
    }

    /**
     * Get all resource statuses
     */
    @GetMapping("/statuses/all")
    public ResponseEntity<Map<String, Object>> getAllResourceStatuses() {
        try {
            List<String> statuses = resourceService.getAllResourceStatuses();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", statuses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to fetch resource statuses"));
        }
    }

    // Helper methods
    private Map<String, Object> buildPaginatedResponse(Page<ResourceDTO> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", page.getContent());
        response.put("totalPages", page.getTotalPages());
        response.put("totalElements", page.getTotalElements());
        response.put("currentPage", page.getNumber());
        response.put("pageSize", page.getSize());
        response.put("hasNext", page.hasNext());
        response.put("hasPrevious", page.hasPrevious());
        return response;
    }

    private Map<String, Object> buildErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}

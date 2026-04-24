package com.smartcampus.resources.controller;

import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.resources.dto.CreateResourceRequest;
import com.smartcampus.resources.dto.ResourceDTO;
import com.smartcampus.resources.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;
    private final UserRepository  userRepository;

    public ResourceController(ResourceService resourceService, UserRepository userRepository) {
        this.resourceService = resourceService;
        this.userRepository  = userRepository;
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    /** Resolve the full User entity from the Spring Security principal */
    private User resolveUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }

    // ── Public read endpoints ─────────────────────────────────────────────────

    /** GET /api/resources */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllResources(
            @RequestParam(defaultValue = "0")        int    page,
            @RequestParam(defaultValue = "10")       int    size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "DESC")     String sortDirection) {
        try {
            Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            return ResponseEntity.ok(buildPaginatedResponse(resourceService.getAllResources(pageable)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to fetch resources"));
        }
    }

    /** GET /api/resources/search */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResources(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(buildPaginatedResponse(
                    resourceService.searchResources(searchTerm, pageable)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to search resources"));
        }
    }

    /** GET /api/resources/filter */
    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterResources(
            @RequestParam(required = false) String  type,
            @RequestParam(required = false) String  status,
            @RequestParam(required = false) String  location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(buildPaginatedResponse(
                    resourceService.getResourcesWithFilters(
                            type, status, location, minCapacity, maxCapacity, pageable)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to filter resources"));
        }
    }

    /** GET /api/resources/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getResourceById(@PathVariable Long id) {
        try {
            ResourceDTO resource = resourceService.getResourceById(id);
            return ResponseEntity.ok(Map.of("success", true, "data", resource));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildErrorResponse("Resource not found"));
        }
    }

    /** GET /api/resources/by-resource-id/{resourceId} */
    @GetMapping("/by-resource-id/{resourceId}")
    public ResponseEntity<Map<String, Object>> getResourceByResourceId(@PathVariable String resourceId) {
        try {
            ResourceDTO resource = resourceService.getResourceByResourceId(resourceId);
            return ResponseEntity.ok(Map.of("success", true, "data", resource));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildErrorResponse("Resource not found"));
        }
    }

    /** GET /api/resources/types/all */
    @GetMapping("/types/all")
    public ResponseEntity<Map<String, Object>> getAllResourceTypes() {
        try {
            List<String> types = resourceService.getAllResourceTypes();
            return ResponseEntity.ok(Map.of("success", true, "data", types));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to fetch resource types"));
        }
    }

    /** GET /api/resources/statuses/all */
    @GetMapping("/statuses/all")
    public ResponseEntity<Map<String, Object>> getAllResourceStatuses() {
        try {
            List<String> statuses = resourceService.getAllResourceStatuses();
            return ResponseEntity.ok(Map.of("success", true, "data", statuses));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("Failed to fetch resource statuses"));
        }
    }

    // ── Protected write endpoints (ADMIN / MANAGER only) ─────────────────────

    /**
     * POST /api/resources
     * Creates a resource and notifies ALL users.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Map<String, Object>> createResource(
            @RequestBody CreateResourceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User admin = resolveUser(userDetails);
            ResourceDTO resource = resourceService.createResource(request, admin);
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
     * PUT /api/resources/{id}
     * Updates resource details.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Map<String, Object>> updateResource(
            @PathVariable Long id,
            @RequestBody CreateResourceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User admin = resolveUser(userDetails);
            ResourceDTO resource = resourceService.updateResource(id, request, admin);
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
     * DELETE /api/resources/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Resource deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildErrorResponse("Failed to delete resource"));
        }
    }

    /**
     * PATCH /api/resources/{id}/status
     * Updates status and notifies ALL users if status changed.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Map<String, Object>> updateResourceStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User admin = resolveUser(userDetails);
            ResourceDTO resource = resourceService.updateResourceStatus(id, status, admin);
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

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Map<String, Object> buildPaginatedResponse(Page<ResourceDTO> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("success",       true);
        response.put("data",          page.getContent());
        response.put("totalPages",    page.getTotalPages());
        response.put("totalElements", page.getTotalElements());
        response.put("currentPage",   page.getNumber());
        response.put("pageSize",      page.getSize());
        response.put("hasNext",       page.hasNext());
        response.put("hasPrevious",   page.hasPrevious());
        return response;
    }

    private Map<String, Object> buildErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}

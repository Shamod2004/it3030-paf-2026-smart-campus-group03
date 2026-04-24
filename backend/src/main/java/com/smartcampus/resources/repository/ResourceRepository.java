package com.smartcampus.resources.repository;

import com.smartcampus.resources.model.Resource;
import com.smartcampus.resources.model.ResourceStatus;
import com.smartcampus.resources.model.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Find by status with pagination
    Page<Resource> findByStatus(ResourceStatus status, Pageable pageable);

    // Find by type with pagination
    Page<Resource> findByType(ResourceType type, Pageable pageable);

    // Find by capacity range
    Page<Resource> findByCapacityBetween(Integer minCapacity, Integer maxCapacity, Pageable pageable);

    // Find by resource ID
    Optional<Resource> findByResourceId(String resourceId);

    // Find by location with pagination
    Page<Resource> findByLocation(String location, Pageable pageable);

    // Search by name, resourceId, or location
    @Query("SELECT r FROM Resource r WHERE " +
            "LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.resourceId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(r.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Resource> searchResources(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Complex filter with multiple criteria
    @Query("SELECT r FROM Resource r WHERE " +
            "(:type IS NULL OR r.type = :type) AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
            "(:maxCapacity IS NULL OR r.capacity <= :maxCapacity)")
    Page<Resource> findWithFilters(
            @Param("type") ResourceType type,
            @Param("status") ResourceStatus status,
            @Param("location") String location,
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity,
            Pageable pageable
    );

    // Check if resource ID exists
    boolean existsByResourceId(String resourceId);
}

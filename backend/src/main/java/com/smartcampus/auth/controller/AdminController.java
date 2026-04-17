package com.smartcampus.auth.controller;

import com.smartcampus.auth.model.User;
import com.smartcampus.auth.service.UserService;
import com.smartcampus.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    /** GET /api/admin/users */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** GET /api/admin/users/{id} */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /** GET /api/admin/users/role/{role} */
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRole(Role.valueOf(role.toUpperCase())));
    }

    /** PATCH /api/admin/users/{id}/role */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Role newRole = Role.valueOf(body.get("role").toUpperCase());
        return ResponseEntity.ok(userService.updateRole(id, newRole));
    }

    /** PATCH /api/admin/users/{id}/toggle-status */
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        return ResponseEntity.ok(userService.setUserEnabled(id, enabled));
    }

    /** DELETE /api/admin/users/{id} */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.setUserEnabled(id, false);
        return ResponseEntity.ok(Map.of("message", "User account disabled successfully"));
    }
}

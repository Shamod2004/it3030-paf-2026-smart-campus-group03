package com.smartcampus.controller;

import com.smartcampus.model.Notification;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /** Helper: resolve current user from security context */
    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * GET /api/notifications
     * Get all notifications for the logged-in user
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user.getId()));
    }

    /**
     * GET /api/notifications/unread
     * Get unread notifications for the logged-in user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(user.getId()));
    }

    /**
     * GET /api/notifications/count
     * Get unread count (for notification bell badge)
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        long count = notificationService.countUnread(user.getId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Mark a single notification as read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        Notification updated = notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(updated);
    }

    /**
     * PATCH /api/notifications/read-all
     * Mark ALL notifications as read
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    /**
     * DELETE /api/notifications/{id}
     * Delete a single notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        notificationService.deleteNotification(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    /**
     * DELETE /api/notifications/clear-all
     * Delete all notifications for the logged-in user
     */
    @DeleteMapping("/clear-all")
    public ResponseEntity<Map<String, String>> clearAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        notificationService.deleteAllForUser(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications cleared"));
    }
}

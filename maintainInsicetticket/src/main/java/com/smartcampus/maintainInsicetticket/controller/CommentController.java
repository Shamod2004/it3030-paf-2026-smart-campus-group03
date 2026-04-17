package com.smartcampus.maintainInsicetticket.controller;

import com.smartcampus.maintainInsicetticket.model.Comment;
import com.smartcampus.maintainInsicetticket.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:55747", "http://127.0.0.1:59031"}, methods = {org.springframework.web.bind.annotation.RequestMethod.GET, org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.PATCH, org.springframework.web.bind.annotation.RequestMethod.DELETE, org.springframework.web.bind.annotation.RequestMethod.OPTIONS})
public class CommentController {
    
    private final CommentService commentService;
    
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        try {
            List<Comment> comments = commentService.getAllComments();
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("Error fetching all comments: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Comment>> getCommentsByTicketId(@PathVariable Long ticketId) {
        log.info("Received request to fetch comments for ticket ID: {}", ticketId);
        try {
            List<Comment> comments = commentService.getCommentsByTicketId(ticketId);
            log.info("Found {} comments for ticket ID: {}", comments.size(), ticketId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("Error fetching comments for ticket {}: {}", ticketId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        try {
            Comment comment = commentService.getCommentById(id);
            if (comment != null) {
                return ResponseEntity.ok(comment);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error fetching comment {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        try {
            if (comment.getMessage() == null || comment.getMessage().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "VALIDATION_ERROR");
                error.put("message", "Comment message cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }
            
            Comment createdComment = commentService.createComment(comment);
            log.info("Created comment: {}", createdComment.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
            
        } catch (Exception e) {
            log.error("Error creating comment: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "CREATION_ERROR");
            error.put("message", "Failed to create comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody Comment commentUpdate) {
        try {
            if (commentUpdate.getMessage() == null || commentUpdate.getMessage().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "VALIDATION_ERROR");
                error.put("message", "Comment message cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (!commentService.commentExists(id)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "NOT_FOUND");
                error.put("message", "Comment not found with id: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            Comment updatedComment = commentService.updateComment(id, commentUpdate);
            log.info("Updated comment: {}", id);
            return ResponseEntity.ok(updatedComment);
            
        } catch (IllegalArgumentException e) {
            log.error("Validation error updating comment {}: {}", id, e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "VALIDATION_ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (Exception e) {
            log.error("Error updating comment {}: {}", id, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "UPDATE_ERROR");
            error.put("message", "Failed to update comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            if (!commentService.commentExists(id)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "NOT_FOUND");
                error.put("message", "Comment not found with id: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            commentService.deleteComment(id);
            log.info("Deleted comment: {}", id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment deleted successfully");
            response.put("id", id.toString());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Validation error deleting comment {}: {}", id, e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "VALIDATION_ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (Exception e) {
            log.error("Error deleting comment {}: {}", id, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "DELETE_ERROR");
            error.put("message", "Failed to delete comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

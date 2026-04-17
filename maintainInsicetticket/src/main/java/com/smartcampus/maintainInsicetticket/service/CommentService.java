package com.smartcampus.maintainInsicetticket.service;

import com.smartcampus.maintainInsicetticket.model.Comment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
public class CommentService {
    
    // In-memory storage for demo purposes
    private final Map<Long, Comment> comments = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    
    public CommentService() {
        // Initialize with some sample comments
        initializeSampleComments();
    }
    
    private void initializeSampleComments() {
        Comment comment1 = Comment.builder()
                .id(idGenerator.getAndIncrement())
                .user("John Smith")
                .role("Student")
                .message("This is a sample comment for testing purposes.")
                .ticketId(1L)
                .timestamp(LocalDateTime.now().toString())
                .edited(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        Comment comment2 = Comment.builder()
                .id(idGenerator.getAndIncrement())
                .user("Jane Doe")
                .role("Faculty")
                .message("Another sample comment to demonstrate the functionality.")
                .ticketId(1L)
                .timestamp(LocalDateTime.now().toString())
                .edited(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        comments.put(comment1.getId(), comment1);
        comments.put(comment2.getId(), comment2);
    }
    
    public List<Comment> getAllComments() {
        return new ArrayList<>(comments.values());
    }
    
    public List<Comment> getCommentsByTicketId(Long ticketId) {
        return comments.values().stream()
                .filter(comment -> comment.getTicketId().equals(ticketId))
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .toList();
    }
    
    public Comment getCommentById(Long id) {
        return comments.get(id);
    }
    
    public Comment createComment(Comment comment) {
        Comment newComment = Comment.builder()
                .id(idGenerator.getAndIncrement())
                .user(comment.getUser())
                .role(comment.getRole())
                .message(comment.getMessage())
                .ticketId(comment.getTicketId())
                .timestamp(LocalDateTime.now().toString())
                .edited(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
                
        comments.put(newComment.getId(), newComment);
        log.info("Created new comment: {}", newComment.getId());
        return newComment;
    }
    
    public Comment updateComment(Long id, Comment commentUpdate) {
        Comment existingComment = comments.get(id);
        if (existingComment == null) {
            throw new IllegalArgumentException("Comment not found with id: " + id);
        }
        
        existingComment.setMessage(commentUpdate.getMessage());
        existingComment.setTimestamp(commentUpdate.getTimestamp());
        existingComment.setEdited(true);
        existingComment.setUpdatedAt(LocalDateTime.now());
        
        log.info("Updated comment: {}", id);
        return existingComment;
    }
    
    public void deleteComment(Long id) {
        Comment removed = comments.remove(id);
        if (removed == null) {
            throw new IllegalArgumentException("Comment not found with id: " + id);
        }
        log.info("Deleted comment: {}", id);
    }
    
    public boolean commentExists(Long id) {
        return comments.containsKey(id);
    }
}

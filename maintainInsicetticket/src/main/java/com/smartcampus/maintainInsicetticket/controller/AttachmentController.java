package com.smartcampus.maintainInsicetticket.controller;

import com.smartcampus.maintainInsicetticket.model.Attachment;
import com.smartcampus.maintainInsicetticket.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:55747"}, methods = {org.springframework.web.bind.annotation.RequestMethod.GET, org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.PATCH, org.springframework.web.bind.annotation.RequestMethod.DELETE, org.springframework.web.bind.annotation.RequestMethod.OPTIONS})
public class AttachmentController {
    
    private final AttachmentService attachmentService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ticketId") Long ticketId) {
        try {
            log.info("Uploading file: {} for ticket: {}", file.getOriginalFilename(), ticketId);
            
            // Validate file
            if (!attachmentService.isValidFileType(file)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "INVALID_FILE_TYPE");
                error.put("message", "Invalid file type. Only JPG, PNG, PDF, and DOC files are allowed.");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Save file
            Attachment attachment = attachmentService.saveAttachment(file, ticketId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("attachment", attachment);
            
            log.info("File uploaded successfully: {}", attachment.getName());
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Validation error during file upload: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "VALIDATION_ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
            
        } catch (IOException e) {
            log.error("IO error during file upload: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "UPLOAD_ERROR");
            error.put("message", "Failed to save file. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            
        } catch (Exception e) {
            log.error("Unexpected error during file upload: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "INTERNAL_ERROR");
            error.put("message", "An unexpected error occurred. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/attachments", filename);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = "application/octet-stream";
                String headerValue = "attachment; filename=\"" + filename + "\"";
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
                        .body(resource);
            } else {
                log.warn("File not found or not readable: {}", filename);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error serving file: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Attachment>> getAttachmentsByTicket(@PathVariable Long ticketId) {
        try {
            List<Attachment> attachments = attachmentService.getAttachmentsByTicketId(ticketId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            log.error("Error fetching attachments for ticket {}: {}", ticketId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getAttachmentById(@PathVariable Long id) {
        try {
            Attachment attachment = attachmentService.getAttachmentById(id);
            if (attachment != null) {
                return ResponseEntity.ok(attachment);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error fetching attachment {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}

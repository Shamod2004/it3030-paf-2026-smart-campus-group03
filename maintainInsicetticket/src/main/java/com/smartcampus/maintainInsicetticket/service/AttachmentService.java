package com.smartcampus.maintainInsicetticket.service;

import com.smartcampus.maintainInsicetticket.model.Attachment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class AttachmentService {
    
    private final String UPLOAD_DIR = "uploads/attachments";
    
    public AttachmentService() {
        // Create upload directory if it doesn't exist
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", UPLOAD_DIR);
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory: {}", e.getMessage());
        }
    }
    
    public Attachment saveAttachment(MultipartFile file, Long ticketId) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        // Check file size (10MB limit)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file to filesystem
        Path uploadPath = Paths.get(UPLOAD_DIR, uniqueFilename);
        Files.copy(file.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create attachment object
        String fileUrl = "/api/attachments/files/" + uniqueFilename;
        
        return Attachment.builder()
                .id(System.currentTimeMillis()) // Simple ID generation
                .name(originalFilename)
                .type(file.getContentType())
                .url(fileUrl)
                .size(file.getSize())
                .ticketId(ticketId)
                .uploadedBy("System User")
                .build();
    }
    
    public List<Attachment> getAttachmentsByTicketId(Long ticketId) {
        // In a real implementation, this would query the database
        // For now, return empty list as placeholder
        return new ArrayList<>();
    }
    
    public Attachment getAttachmentById(Long id) {
        // In a real implementation, this would query the database
        // For now, return null as placeholder
        return null;
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
    
    public boolean isValidFileType(MultipartFile file) {
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();
        
        // Allowed MIME types
        List<String> allowedTypes = List.of(
            "image/jpeg",
            "image/png", 
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        
        // Check MIME type
        if (!allowedTypes.contains(contentType)) {
            return false;
        }
        
        // Check file extension
        if (filename != null) {
            String extension = getFileExtension(filename).toLowerCase();
            List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx");
            return allowedExtensions.contains(extension);
        }
        
        return false;
    }
}

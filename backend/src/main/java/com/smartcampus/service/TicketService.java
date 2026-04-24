package com.smartcampus.service;

import com.smartcampus.enums.Role;
import com.smartcampus.enums.TicketStatus;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.TicketAttachment;
import com.smartcampus.model.TicketComment;
import com.smartcampus.model.User;
import com.smartcampus.repository.TicketAttachmentRepository;
import com.smartcampus.repository.TicketCommentRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private TicketAttachmentRepository attachmentRepository;

    @Autowired
    private TicketCommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByCreator(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ticketRepository.findByCreator(user);
    }

    public List<Ticket> getTicketsByTechnician(Long technicianId) {
        User tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        return ticketRepository.findByTechnician(tech);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    @Transactional
    public Ticket createTicketWithFiles(Ticket ticket, List<MultipartFile> files, User creator) {
        ticket.setCreator(creator);
        ticket.setStatus(TicketStatus.OPEN);
        Ticket savedTicket = ticketRepository.save(ticket);

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = fileStorageService.storeFile(file);
                    
                    // Generate full URL
                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/uploads/")
                            .path(fileName)
                            .toUriString();

                    TicketAttachment attachment = new TicketAttachment();
                    attachment.setTicket(savedTicket);
                    attachment.setImageUrl(fileDownloadUri);
                    attachmentRepository.save(attachment);
                }
            }
        }

        // Send notifications to all Admins
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        String message = String.format("New Ticket from %s: %s", creator.getName(), savedTicket.getTitle());
        for (User admin : admins) {
            notificationService.sendNotification(
                admin.getId(), 
                message, 
                "TICKET_CREATED", 
                savedTicket.getId().toString(), 
                "TICKET",
                creator.getName()
            );
        }

        return savedTicket;
    }

    @Transactional
    public Ticket updateTicketStatus(Long ticketId, TicketStatus status, String notes, User updatedBy) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(status);
        
        if (status == TicketStatus.REJECTED) {
            ticket.setRejectionReason(notes);
        } else {
            ticket.setResolutionNotes(notes);
        }
        
        Ticket saved = ticketRepository.save(ticket);

        // Notify Creator
        String message = String.format("Your ticket '%s' is now %s", ticket.getTitle(), status.name().replace("_", " "));
        String notifType = status == TicketStatus.RESOLVED ? "TICKET_RESOLVED" : 
                          status == TicketStatus.REJECTED ? "TICKET_REJECTED" : "TICKET_UPDATED";
        
        notificationService.sendNotification(
            ticket.getCreator().getId(),
            message,
            notifType,
            ticket.getId().toString(),
            "TICKET",
            updatedBy.getName()
        );

        return saved;
    }

    @Transactional
    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = getTicketById(ticketId);
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        
        ticket.setTechnician(technician);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        Ticket saved = ticketRepository.save(ticket);

        // Notify Creator
        notificationService.sendNotification(
            ticket.getCreator().getId(),
            String.format("Technician %s has been assigned to your ticket: %s", technician.getName(), ticket.getTitle()),
            "TICKET_ASSIGNED",
            ticket.getId().toString(),
            "TICKET",
            "Administration"
        );

        return saved;
    }

    @Transactional
    public TicketComment addComment(Long ticketId, String content, User author) {
        Ticket ticket = getTicketById(ticketId);
        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(content);
        TicketComment saved = commentRepository.save(comment);

        // Notify relevant party
        User recipient = null;
        if (author.getId().equals(ticket.getCreator().getId())) {
            // Reporter commented -> notify technician
            recipient = ticket.getTechnician();
        } else {
            // Someone else (admin/tech) commented -> notify creator
            recipient = ticket.getCreator();
        }

        if (recipient != null) {
            notificationService.sendNotification(
                recipient.getId(),
                String.format("New comment on ticket '%s'", ticket.getTitle()),
                "TICKET_UPDATED",
                ticket.getId().toString(),
                "TICKET",
                author.getName()
            );
        }

        return saved;
    }

    @Transactional
    public Ticket updateTicket(Long id, Ticket updatedTicket) {
        Ticket ticket = getTicketById(id);
        ticket.setTitle(updatedTicket.getTitle());
        ticket.setCategory(updatedTicket.getCategory());
        ticket.setDescription(updatedTicket.getDescription());
        ticket.setResourceLocation(updatedTicket.getResourceLocation());
        ticket.setPriority(updatedTicket.getPriority());
        ticket.setPreferredContact(updatedTicket.getPreferredContact());
        return ticketRepository.save(ticket);
    }

    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }
}

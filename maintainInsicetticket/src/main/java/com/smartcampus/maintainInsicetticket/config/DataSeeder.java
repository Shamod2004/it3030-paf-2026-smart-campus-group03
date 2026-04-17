package com.smartcampus.maintainInsicetticket.config;

import com.smartcampus.maintainInsicetticket.model.Ticket;
import com.smartcampus.maintainInsicetticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    
    private final TicketRepository ticketRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (ticketRepository.count() == 0) {
            seedSampleTickets();
        }
    }
    
    private void seedSampleTickets() {
        log.info("Seeding sample tickets...");
        
        // Sample tickets data
        Ticket[] tickets = {
            new Ticket("INC-1042", "Projector not working", "Electrical issue", "HIGH", "OPEN", 
                      "Jane Doe", "Unassigned", "Projector in Room 201 is not turning on. Checked power connections, seems to be internal issue."),
            
            new Ticket("INC-1043", "Wi-Fi down in Library", "Network issue", "CRITICAL", "IN_PROGRESS", 
                      "Sarah Smith", "Mike T.", "Wi-Fi connectivity completely lost in the main library area. Students unable to access online resources."),
            
            new Ticket("INC-1044", "Broken Chair in Room 204", "Furniture Damage", "LOW", "RESOLVED", 
                      "Ann Lee", "Dave W", "One of the chairs in Room 204 has a broken leg. Needs immediate repair or replacement."),
            
            new Ticket("INC-1045", "Air conditioning not working", "HVAC", "MEDIUM", "OPEN", 
                      "John Brown", "Unassigned", "AC unit in Lab 302 is not cooling properly. Temperature is rising above comfortable levels."),
            
            new Ticket("INC-1046", "Computer lab printer jam", "Equipment", "LOW", "RESOLVED", 
                      "Emily Davis", "Tom R.", "Printer in Computer Lab 1 is frequently jamming paper. Maintenance required."),
            
            new Ticket("INC-1047", "Lighting fixture flickering", "Electrical issue", "MEDIUM", "IN_PROGRESS", 
                      "Michael Wilson", "Sarah K.", "Ceiling lights in Corridor B are flickering intermittently. Potential electrical hazard."),
            
            new Ticket("INC-1048", "Door access card not working", "Security", "HIGH", "OPEN", 
                      "David Martinez", "Unassigned", "Access card system for Main Entrance is not recognizing staff cards. Security concern."),
            
            new Ticket("INC-1049", "Water leak in restroom", "Plumbing", "CRITICAL", "IN_PROGRESS", 
                      "Lisa Anderson", "James P.", "Water leak from ceiling in Men's Restroom, Floor 2. Immediate attention required."),
            
            new Ticket("INC-1050", "Whiteboard replacement needed", "Facilities", "LOW", "RESOLVED", 
                      "Robert Taylor", "Maintenance Team", "Whiteboard in Conference Room A is old and stained. Needs replacement."),
            
            new Ticket("INC-1051", "Internet slow in dormitory", "Network issue", "HIGH", "OPEN", 
                      "Jennifer Thomas", "Unassigned", "Internet connection is extremely slow in Dormitory Building C. Students reporting connectivity issues."),
            
            new Ticket("INC-1052", "Elevator maintenance", "Facilities", "MEDIUM", "RESOLVED", 
                      "William Jackson", "Elevator Tech", "Elevator in Science Building is making unusual noises. Needs inspection."),
            
            new Ticket("INC-1053", "Fire alarm test", "Safety", "CRITICAL", "REJECTED", 
                      "Patricia White", "Security Team", "Request for monthly fire alarm system test. Already scheduled for next week."),
            
            new Ticket("INC-1054", "Lab equipment calibration", "Equipment", "MEDIUM", "IN_PROGRESS", 
                      "Christopher Harris", "Lab Tech", "Chemistry lab equipment needs calibration before upcoming experiments."),
            
            new Ticket("INC-1055", "Parking lot lighting", "Electrical issue", "LOW", "OPEN", 
                      "Daniel Martin", "Unassigned", "Several lights in the main parking lot are not working, creating safety concerns at night."),
            
            new Ticket("INC-1056", "Server room cooling", "HVAC", "CRITICAL", "IN_PROGRESS", 
                      "Nancy Thompson", "IT Support", "Cooling system in server room is not functioning optimally. Temperature rising above acceptable levels.")
        };
        
        for (Ticket ticket : tickets) {
            ticketRepository.save(ticket);
        }
        
        log.info("Sample tickets seeded successfully! Total tickets: {}", ticketRepository.count());
    }
}

-- MySQL Schema for Smart Campus Maintenance System

CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    submitted_by VARCHAR(100) NOT NULL,
    assigned_technician VARCHAR(100),
    description TEXT,
    reject_reason TEXT,
    resolution_notes TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO tickets (ticket_id, title, category, priority, status, submitted_by, assigned_technician, description, created_date, updated_date) VALUES
('INC-1001', 'Ceiling lights flickering in Corridor B', 'Electrical', 'MEDIUM', 'IN_PROGRESS', 'John Doe', 'Sarah K.', 'Ceiling lights in Corridor B are flickering intermittently.', '2026-04-01 10:53:47', '2026-04-01 11:30:00'),
('INC-1002', 'Water leak in Room 203', 'Plumbing', 'HIGH', 'OPEN', 'Jane Smith', NULL, 'Significant water leak detected in Room 203.', '2026-04-01 09:15:22', '2026-04-01 09:15:22'),
('INC-1003', 'AC not working in Lecture Hall A', 'HVAC', 'LOW', 'RESOLVED', 'Mike Johnson', 'Tom Wilson', 'Air conditioning unit in Lecture Hall A not cooling properly.', '2026-03-31 14:20:15', '2026-04-01 16:45:30'),
('INC-1004', 'Broken window in Library', 'General', 'MEDIUM', 'OPEN', 'Emily Brown', NULL, 'Window pane cracked in main library reading area.', '2026-04-01 08:45:33', '2026-04-01 08:45:33'),
('INC-1005', 'Elevator malfunction in Building C', 'General', 'CRITICAL', 'IN_PROGRESS', 'David Lee', 'Robert Chen', 'Elevator stuck between floors intermittently.', '2026-04-01 07:30:12', '2026-04-01 08:15:45'),
('INC-1006', 'Network outage in Computer Lab', 'IT', 'HIGH', 'RESOLVED', 'Sarah Wilson', 'Alex Kumar', 'Complete network connectivity loss in Computer Lab 2.', '2026-03-31 16:10:28', '2026-04-01 10:20:15'),
('INC-1007', 'Door lock broken in Admin Office', 'Security', 'MEDIUM', 'OPEN', 'Chris Martin', NULL, 'Electronic door lock malfunctioning in main administration office.', '2026-04-01 11:25:44', '2026-04-01 11:25:44'),
('INC-1008', 'Fire alarm test needed', 'Safety', 'LOW', 'REJECTED', 'Lisa Anderson', NULL, 'Request for routine fire alarm system testing.', '2026-03-30 13:45:19', '2026-04-01 09:30:00'),
('INC-1009', 'Parking lot lighting repair', 'Electrical', 'MEDIUM', 'IN_PROGRESS', 'James Taylor', 'Sarah K.', 'Multiple light fixtures out in main parking lot.', '2026-04-01 12:15:36', '2026-04-01 13:00:22'),
('INC-1010', 'Roof leak in Auditorium', 'Plumbing', 'HIGH', 'OPEN', 'Maria Garcia', NULL, 'Water leaking from ceiling during rain events in main auditorium.', '2026-04-01 10:30:55', '2026-04-01 10:30:55');

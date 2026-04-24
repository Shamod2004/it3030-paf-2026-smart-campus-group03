USE paf;

CREATE TABLE IF NOT EXISTS resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  description LONGTEXT,
  image_url LONGTEXT,
  status VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_used_at DATETIME,
  total_bookings BIGINT DEFAULT 0,
  INDEX idx_resource_id (resource_id),
  INDEX idx_name (name),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_location (location)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resource_bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id BIGINT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  INDEX idx_resource (resource_id),
  INDEX idx_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resource_availability (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id BIGINT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  INDEX idx_resource (resource_id),
  UNIQUE KEY unique_availability (resource_id, date, start_time)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resource_maintenance (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id BIGINT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  INDEX idx_resource (resource_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW v_active_resources AS
SELECT * FROM resources WHERE status = 'ACTIVE';

CREATE OR REPLACE VIEW v_resource_utilization AS
SELECT 
  r.id,
  r.resource_id,
  r.name,
  COUNT(rb.id) as booking_count,
  MAX(rb.end_time) as last_booked
FROM resources r
LEFT JOIN resource_bookings rb ON r.id = rb.resource_id
GROUP BY r.id, r.resource_id, r.name;

INSERT INTO resources (resource_id, name, type, capacity, location, description, image_url, status, created_at, updated_at)
VALUES 
('R001', 'Main Lecture Hall', 'ROOM', 150, 'Building A, 1st Floor', 'Large lecture hall with advanced AV equipment and seating for 150 students', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R002', 'Advanced Robotics Lab', 'LAB', 40, 'Building B, 2nd Floor', 'State-of-the-art robotics laboratory equipped with industrial robots and programming stations', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R003', 'Oscilloscope Kit', 'EQUIPMENT', 5, 'Lab Storage Room', 'High-precision digital oscilloscope kit for electrical engineering measurements', 'https://images.unsplash.com/photo-1518611505868-48510c2e2e38?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R004', 'Seminar Room 1', 'ROOM', 30, 'Building C, 3rd Floor', 'Intimate seminar room with video conferencing capabilities and whiteboard walls', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R005', 'Chemistry Lab', 'LAB', 25, 'Building D, Ground Floor', 'Fully equipped chemistry laboratory with fume hoods, benches, and safety equipment', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=250&fit=crop', 'MAINTENANCE', NOW(), NOW()),
('R006', 'Projector Unit', 'EQUIPMENT', 10, 'Media Equipment Store', 'High-brightness LED projector suitable for large halls and outdoor presentations', 'https://images.unsplash.com/photo-1559056169-641ef8ac8bf9?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R007', 'Computer Lab A', 'LAB', 50, 'Building A, 2nd Floor', 'Modern computer lab with 50 workstations, high-speed internet, and specialized software', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R008', 'Meeting Room 1', 'ROOM', 20, 'Building C, 1st Floor', 'Executive meeting room with conference table, video phone, and refreshment area', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop', 'INACTIVE', NOW(), NOW()),
('R009', 'Microwave Spectrometer', 'EQUIPMENT', 2, 'Physics Lab', 'Precision microwave frequency measurement equipment for research', 'https://images.unsplash.com/photo-1518611505868-48510c2e2e38?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW()),
('R010', 'Biology Lab', 'LAB', 35, 'Building E, 3rd Floor', 'Biology laboratory with microscopes, incubators, and bio-safety equipment', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=250&fit=crop', 'ACTIVE', NOW(), NOW());

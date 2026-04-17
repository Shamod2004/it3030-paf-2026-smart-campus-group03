-- Database Schema Validation Script
-- Use this to validate the database structure and data

-- Check if database exists
SHOW DATABASES LIKE 'maintainInsicetticket';

-- Use the database
USE maintainInsicetticket;

-- Check if tables exist
SHOW TABLES;

-- Check tickets table structure
DESCRIBE tickets;

-- Check if view exists
SHOW TABLES LIKE 'dashboard_stats';

-- Check view structure if it exists
SHOW CREATE VIEW dashboard_stats;

-- Validate sample data
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT ticket_id) as unique_tickets,
    COUNT(DISTINCT category) as unique_categories,
    COUNT(DISTINCT priority) as unique_priorities,
    COUNT(DISTINCT status) as unique_statuses
FROM tickets;

-- Check for any NULL values in required fields
SELECT 
    'title' as field_name,
    COUNT(*) as null_count
FROM tickets 
WHERE title IS NULL
UNION ALL
SELECT 
    'category' as field_name,
    COUNT(*) as null_count
FROM tickets 
WHERE category IS NULL
UNION ALL
SELECT 
    'priority' as field_name,
    COUNT(*) as null_count
FROM tickets 
WHERE priority IS NULL
UNION ALL
SELECT 
    'status' as field_name,
    COUNT(*) as null_count
FROM tickets 
WHERE status IS NULL
UNION ALL
SELECT 
    'submitted_by' as field_name,
    COUNT(*) as null_count
FROM tickets 
WHERE submitted_by IS NULL;

-- Check ticket_id uniqueness
SELECT 
    ticket_id,
    COUNT(*) as duplicate_count
FROM tickets 
GROUP BY ticket_id 
HAVING COUNT(*) > 1;

-- Check dashboard stats view if it exists
SELECT * FROM dashboard_stats;

-- Test sample queries
-- Get all tickets
SELECT ticket_id, title, status, priority FROM tickets LIMIT 5;

-- Get tickets by status
SELECT status, COUNT(*) as count FROM tickets GROUP BY status;

-- Get tickets by category
SELECT category, COUNT(*) as count FROM tickets GROUP BY category;

-- Get tickets by priority
SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority;

-- Check date formats
SELECT 
    MIN(created_date) as earliest_created,
    MAX(created_date) as latest_created,
    MIN(updated_date) as earliest_updated,
    MAX(updated_date) as latest_updated
FROM tickets;

-- Validate data integrity
SELECT 
    'Data Validation Results' as validation_type,
    'All checks completed' as status,
    NOW() as validation_timestamp;

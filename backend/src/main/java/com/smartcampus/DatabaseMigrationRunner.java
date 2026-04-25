package com.smartcampus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- PERFORMING DATABASE REPAIR ---");
        
        // 1. Drop the Foreign Key constraint first
        try {
            jdbcTemplate.execute("ALTER TABLE tickets DROP FOREIGN KEY FKsytxppnwol0ckyehli7bqqbcr;");
            System.out.println("[SUCCESS] Dropped foreign key: FKsytxppnwol0ckyehli7bqqbcr");
        } catch (Exception e) {
            System.out.println("[SKIP] Foreign key drop: " + e.getMessage());
        }

        // 2. Drop the column
        try {
            jdbcTemplate.execute("ALTER TABLE tickets DROP COLUMN created_by;");
            System.out.println("[SUCCESS] Dropped orphaned column: created_by");
        } catch (Exception e) {
            System.out.println("[SKIP] Column drop: " + e.getMessage());
        }

        // 3. Update Notifications table for sender_name
        try {
            jdbcTemplate.execute("ALTER TABLE notifications ADD COLUMN sender_name VARCHAR(255);");
            System.out.println("[SUCCESS] Added column sender_name to notifications");
        } catch (Exception e) {
            System.out.println("[SKIP] Notification column add: " + e.getMessage());
        }

        System.out.println("--- DATABASE REPAIR COMPLETE ---");
    }
}

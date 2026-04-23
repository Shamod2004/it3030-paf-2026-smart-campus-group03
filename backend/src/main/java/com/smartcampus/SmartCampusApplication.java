package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class SmartCampusApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }

    @Bean
    public CommandLineRunner fixDatabaseSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println(">>> Checking and fixing database schema for Enum columns...");
                jdbcTemplate.execute("ALTER TABLE tickets MODIFY COLUMN status VARCHAR(20)");
                jdbcTemplate.execute("ALTER TABLE tickets MODIFY COLUMN priority VARCHAR(20)");
                jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(20)");
                System.out.println(">>> Database schema updated successfully.");
            } catch (Exception e) {
                System.out.println(">>> Note: Database update check skipped or already updated: " + e.getMessage());
            }
        };
    }
}

# MySQL Setup Guide for Smart Campus Maintenance System

## Overview
This guide will help you set up MySQL database for the Smart Campus Maintenance Ticket System.

## Prerequisites
- MySQL Server installed and running
- MySQL Workbench (optional, for database management)
- Administrative access to MySQL

## Step 1: Install MySQL Server

### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer and select "Server only" or "Developer Default"
3. Follow the installation wizard
4. Set root password when prompted (recommended: `root123` or leave empty for development)
5. Configure MySQL to start automatically

### macOS
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

## Step 2: Create Database

### Option A: Using MySQL Command Line
```sql
-- Log in to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE maintainInsicetticket;

-- Create user (optional, for better security)
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON maintainInsicetticket.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to MySQL server (root user)
3. Execute: `CREATE DATABASE maintainInsicetticket;`
4. (Optional) Create a dedicated user for the application

## Step 3: Configure Application Properties

Update `src/main/resources/application.properties`:

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/maintainInsicetticket?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Enable schema.sql execution after database is ready
spring.sql.init.mode=always
```

## Step 4: Start the Application

1. Ensure MySQL server is running
2. Navigate to backend directory
3. Run: `mvn spring-boot:run`

The application will:
- Connect to MySQL database
- Create tables automatically (using JPA/Hibernate)
- Execute schema.sql for initial data (if enabled)
- Start the REST API server

## Step 5: Verify Database Setup

### Check Tables
```sql
USE maintainInsicetticket;
SHOW TABLES;
```

### Check Sample Data
```sql
SELECT * FROM tickets LIMIT 5;
```

### Check Dashboard View
```sql
SELECT * FROM dashboard_stats;
```

## Troubleshooting

### Common Issues

#### 1. "Access denied for user 'root'@'localhost'"
**Solution**: 
- Check MySQL username and password
- Reset MySQL root password if needed
- Create a dedicated user for the application

#### 2. "Communications link failure"
**Solution**:
- Ensure MySQL server is running
- Check if MySQL is on default port 3306
- Verify firewall settings

#### 3. "Unknown database 'maintainInsicetticket'"
**Solution**:
- Create the database manually: `CREATE DATABASE maintainInsicetticket;`
- Check database name spelling

#### 4. "Table 'tickets' doesn't exist"
**Solution**:
- Set `spring.jpa.hibernate.ddl-auto=update` or `create-drop`
- Check if schema.sql is executed properly

### MySQL Commands

#### Start/Stop MySQL Service
```bash
# Windows
net start mysql
net stop mysql

# macOS
brew services start mysql
brew services stop mysql

# Linux
sudo systemctl start mysql
sudo systemctl stop mysql
```

#### Check MySQL Status
```bash
# Windows
sc query mysql

# macOS/Linux
brew services list | grep mysql
# or
sudo systemctl status mysql
```

#### Reset Root Password (Windows)
```bash
# Stop MySQL
net stop mysql

# Start MySQL in safe mode
mysqld --skip-grant-tables

# Connect and reset password (in another terminal)
mysql -u root
USE mysql;
UPDATE user SET authentication_string = PASSWORD('newpassword') WHERE User = 'root';
FLUSH PRIVILEGES;
EXIT;

# Restart MySQL
net start mysql
```

## Database Schema

### Tables Created Automatically
- `tickets` - Main ticket data
- `dashboard_stats` - View for statistics

### Ticket Table Structure
```sql
CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    submitted_by VARCHAR(100) NOT NULL,
    assigned_technician VARCHAR(100),
    description TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Production Considerations

### Security
- Use dedicated database user (not root)
- Set strong password
- Enable SSL in production
- Limit database user permissions

### Performance
- Configure connection pool
- Add database indexes
- Monitor query performance
- Set up database backups

### Backup Strategy
```bash
# Full backup
mysqldump -u root -p maintainInsicetticket > backup.sql

# Restore backup
mysql -u root -p maintainInsicetticket < backup.sql
```

## Next Steps

1. Install and configure MySQL
2. Create the database
3. Update application.properties with correct credentials
4. Start the application
5. Verify API endpoints are working
6. Test frontend integration

## Support

For additional help:
- Check MySQL documentation: https://dev.mysql.com/doc/
- Spring Boot MySQL guide: https://spring.io/guides/gs/accessing-data-mysql/
- Application logs for detailed error information

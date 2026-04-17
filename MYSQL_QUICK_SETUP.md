# Quick MySQL Setup Guide

## 🚀 Quick Setup Steps

### Step 1: Install MySQL (if not installed)
```bash
# Download from: https://dev.mysql.com/downloads/installer/
# Choose "Developer Default" or "Server only"
# Set root password when prompted (or leave empty for development)
```

### Step 2: Start MySQL Service
```bash
# Windows
net start mysql

# Or via Services.msc
# Find "MySQL80" or similar, right-click -> Start
```

### Step 3: Create Database
```bash
# Open MySQL Command Line Client
mysql -u root -p

# Create database
CREATE DATABASE maintainInsicetticket;

# Exit
EXIT;
```

### Step 4: Test Connection
```bash
# Test database connection
mysql -u root -p -e "SHOW DATABASES;"

# You should see "maintainInsicetticket" in the list
```

### Step 5: Run Application
```bash
# Navigate to backend directory
cd maintainInsicetticket

# Start Spring Boot
mvn spring-boot:run
```

## 🔧 Alternative Setup (Using XAMPP/WAMP)

### If you have XAMPP:
```bash
# Start XAMPP Control Panel
# Start MySQL service
# Use phpMyAdmin to create database
# Database name: maintainInsicetticket
```

### If you have WAMP:
```bash
# Start WAMP
# Start MySQL service
# Use phpMyAdmin to create database
# Database name: maintainInsicetticket
```

## 🐛 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution:**
1. Reset MySQL root password
2. Or create a new user:
```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON maintainInsicetticket.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Communications link failure"
**Solution:**
1. Ensure MySQL service is running
2. Check if MySQL is on port 3306
3. Verify firewall settings

### Error: "Unknown database 'maintainInsicetticket'"
**Solution:**
1. Create database manually:
```sql
CREATE DATABASE maintainInsicetticket;
```

## 📋 Quick Commands

### Check MySQL Status
```bash
# Windows
net start mysql
sc query mysql

# Check if running
netstat -ano | findstr :3306
```

### Reset Root Password (Windows)
```bash
# Stop MySQL
net stop mysql

# Start in safe mode
mysqld --skip-grant-tables

# Reset password (new terminal)
mysql -u root
USE mysql;
UPDATE user SET authentication_string = PASSWORD('newpassword') WHERE User = 'root';
FLUSH PRIVILEGES;
EXIT;

# Restart MySQL
net start mysql
```

## 🎯 Expected Results

After successful setup, you should see:
```
[INFO] Started MaintainInsicetticketApplication in X.XXX seconds
[INFO] Sample tickets seeded successfully! Total tickets: 15
```

And API endpoints should work:
```bash
curl http://localhost:8080/api/dashboard/tickets
```

## 🚀 Run the Setup Script

Use the provided batch file:
```bash
# Double-click SETUP_MYSQL.bat
# Or run from command line
SETUP_MYSQL.bat
```

This script will:
1. Check MySQL installation
2. Start MySQL service
3. Create database
4. Verify setup
5. Start Spring Boot application

## 📞 Getting Help

If you encounter issues:
1. Check MySQL error logs: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
2. Check application logs in console output
3. Refer to `MYSQL_SETUP_GUIDE.md` for detailed instructions
4. Ensure Java 17+ is installed

## ✅ Success Indicators

✅ MySQL service is running  
✅ Database `maintainInsicetticket` exists  
✅ Application starts without database errors  
✅ API endpoints return data  
✅ Console shows "Sample tickets seeded"  

Once you see all these indicators, your MySQL setup is complete!

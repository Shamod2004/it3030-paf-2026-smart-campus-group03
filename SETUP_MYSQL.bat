@echo off
echo ========================================
echo MySQL Setup for Smart Campus System
echo ========================================
echo.

echo Step 1: Checking if MySQL is installed...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed or not in PATH
    echo Please install MySQL from https://dev.mysql.com/downloads/installer/
    pause
    exit /b 1
)

echo MySQL is installed
echo.

echo Step 2: Starting MySQL service...
net start mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo Failed to start MySQL service
    echo Trying alternative method...
    sc start mysql >nul 2>&1
)

echo Step 3: Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS maintainInsicetticket;" 2>nul
if %errorlevel% neq 0 (
    echo Failed to create database
    echo Please check MySQL credentials
    echo Make sure MySQL server is running
    pause
    exit /b 1
)

echo Database created successfully
echo.

echo Step 4: Verifying database...
mysql -u root -p -e "USE maintainInsicetticket; SHOW TABLES;" 2>nul
if %errorlevel% neq 0 (
    echo Database verification failed
    pause
    exit /b 1
)

echo Database verified successfully
echo.

echo Step 5: Starting Spring Boot application...
echo.
cd maintainInsicetticket
mvn spring-boot:run

echo.
echo Setup completed!
pause

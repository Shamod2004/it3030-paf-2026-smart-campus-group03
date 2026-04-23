@echo off
:: ============================================================
:: Smart Campus Backend - Auto Setup & Run Script
:: Downloads Maven if not installed, then runs Spring Boot
:: ============================================================

setlocal enabledelayedexpansion

set "MAVEN_VERSION=3.9.6"
set "MAVEN_DIR=C:\maven"
set "MAVEN_ZIP=%TEMP%\apache-maven.zip"
set "MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip"

:: ── Check if Maven already available ─────────────────────────────────────
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Maven found. Starting Spring Boot...
    mvn spring-boot:run
    exit /b
)

:: ── Check if already downloaded to C:\maven ──────────────────────────────
if exist "%MAVEN_DIR%\bin\mvn.cmd" (
    echo [OK] Maven found at %MAVEN_DIR%. Starting Spring Boot...
    set "PATH=%MAVEN_DIR%\bin;%PATH%"
    mvn spring-boot:run
    exit /b
)

:: ── Download Maven ────────────────────────────────────────────────────────
echo [INFO] Maven not found. Downloading Maven %MAVEN_VERSION%...
echo [INFO] This is a one-time setup (about 10MB)...

powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%' -UseBasicParsing }"

if not exist "%MAVEN_ZIP%" (
    echo [ERROR] Download failed. Please install Maven manually:
    echo   1. Go to https://maven.apache.org/download.cgi
    echo   2. Download apache-maven-*-bin.zip
    echo   3. Extract to C:\maven
    echo   4. Add C:\maven\bin to your System PATH
    pause
    exit /b 1
)

:: ── Extract ───────────────────────────────────────────────────────────────
echo [INFO] Extracting Maven to C:\maven...
powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath 'C:\' -Force"

:: Rename extracted folder
if exist "C:\apache-maven-%MAVEN_VERSION%" (
    if exist "%MAVEN_DIR%" rmdir /s /q "%MAVEN_DIR%"
    rename "C:\apache-maven-%MAVEN_VERSION%" "maven"
)

if not exist "%MAVEN_DIR%\bin\mvn.cmd" (
    echo [ERROR] Extraction failed. Please extract manually to C:\maven
    pause
    exit /b 1
)

:: ── Add to PATH for this session ──────────────────────────────────────────
set "PATH=%MAVEN_DIR%\bin;%PATH%"
echo [OK] Maven %MAVEN_VERSION% installed at C:\maven

:: ── Permanently add to User PATH ──────────────────────────────────────────
powershell -Command "[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path','User') + ';C:\maven\bin', 'User')"
echo [INFO] Added Maven to your PATH permanently (restart terminal to take effect globally)

:: ── Run Spring Boot ───────────────────────────────────────────────────────
echo.
echo [INFO] Starting Smart Campus Backend...
echo [INFO] First run will download dependencies (~50MB). Please wait...
echo.
mvn spring-boot:run

# Smart Campus Operations Hub - Backend

Spring Boot REST API for the Smart Campus Operations Hub (IT3030 Assignment).

## Tech Stack
- Java 17
- Spring Boot 3.2
- Spring Security + JWT + OAuth2 (Google)
- Spring Data JPA + MySQL
- Swagger/OpenAPI

## Modules
| Module | Endpoint Base | Description |
|--------|--------------|-------------|
| A - Facilities | `/api/facilities` | Facilities & Assets Catalogue |
| B - Bookings | `/api/bookings` | Booking Management |
| C - Tickets | `/api/tickets` | Maintenance & Incident Ticketing |
| D - Notifications | `/api/notifications` | Notifications |
| E - Auth | `/api/auth` | Authentication & Authorization |

## Setup

1. Create MySQL database: `smart_campus`
2. Update `application.properties` with your DB credentials and Google OAuth2 keys
3. Run: `mvn spring-boot:run`
4. Swagger UI: `http://localhost:8080/swagger-ui.html`

## Roles
- `USER` - Can browse facilities and make bookings
- `TECHNICIAN` - Can handle maintenance tickets
- `MANAGER` - Can approve/reject bookings
- `ADMIN` - Full access

## Build & Test
```bash
mvn clean install
mvn test
```

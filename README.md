# Smart Campus Operations Hub

A full-stack web application for managing campus resources, bookings, and maintenance tickets. Users can browse and book campus resources, raise support tickets, and receive notifications. Admins and managers handle approvals, user roles, and resource management.

---

## Tech Stack

### Backend
- Java 17 + Spring Boot 3.2.0
- Spring Security + JWT (jjwt 0.11.5) + Google OAuth2
- Spring Data JPA + Hibernate (ddl-auto: update)
- MySQL (database: `paf`, port `3306`)
- Swagger / OpenAPI (springdoc 2.3.0)
- Runs on port **8081**

### Frontend
- React 18 + Vite 5
- React Router v6
- Axios
- react-hot-toast, lucide-react, react-icons, date-fns
- Runs on port **3000**

---

## User Roles

| Role | Permissions |
|------|-------------|
| `USER` | Browse resources, create bookings, raise tickets, view notifications |
| `TECHNICIAN` | View and update assigned tickets |
| `MANAGER` | Approve/reject bookings, manage resources |
| `ADMIN` | Full access — all of the above + user management, delete anything |

---

## Project Structure

```
smart-campus/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/smartcampus/
│   │   ├── config/                   # Security, JWT filter, CORS, OAuth2, Swagger
│   │   ├── controller/               # REST controllers
│   │   ├── model/                    # JPA entities (User, Booking, Ticket, Notification)
│   │   ├── dto/                      # Request / Response DTOs
│   │   ├── repository/               # Spring Data JPA repositories
│   │   ├── service/                  # Business logic
│   │   ├── enums/                    # Role, TicketStatus, TicketPriority
│   │   ├── exception/                # GlobalExceptionHandler + custom exceptions
│   │   ├── resources/                # Resource module (model, repo, service, controller)
│   │   └── util/                     # JwtUtil, FileUploadUtil
│   ├── src/main/resources/
│   │   └── application.yml           # DB, security, server config
│   └── pom.xml
│
└── frontend/                         # React + Vite SPA
    └── src/
        ├── api/                      # Axios instance + API modules
        ├── components/               # Reusable UI components + route guards
        ├── layouts/                  # App, Dashboard, Public layouts
        ├── pages/                    # auth/, admin/, bookings/, tickets/, dashboard/
        ├── services/                 # bookingService, ticketService, authService...
        ├── hooks/                    # useAuth, useFetch
        ├── utils/                    # constants, helpers
        └── styles/                   # CSS per component
```

---

## Core Modules & Flow

### 1. Authentication
- Register / Login → JWT token issued → stored client-side
- Google OAuth2 → redirects to `/oauth2/authorization/google` → success/failure handlers issue JWT
- All protected routes use `JwtAuthFilter` to validate the token on every request

### 2. Resources
- Admin/Manager creates resources (rooms, labs, equipment) with type, capacity, location, and availability windows
- Users browse available resources via resource cards
- Resource statuses: `ACTIVE`, `INACTIVE`, `MAINTENANCE`

### 3. Bookings
- User selects a resource → fills booking form (date, time, purpose, attendees)
- Server-side conflict check prevents double-booking the same resource/time slot
- Booking starts as `PENDING`
- Admin/Manager approves (`APPROVED`) or rejects (`REJECTED`) with an optional reason
- User can cancel their own booking (`CANCELLED`)
- Notifications are sent on every status change

### 4. Tickets (Maintenance / Support)
- User creates a ticket with title, category, description, location, priority, and optional file attachments
- Ticket starts as `OPEN`
- Admin/Manager assigns a `TECHNICIAN`
- Technician updates status: `OPEN` → `IN_PROGRESS` → `RESOLVED`
- Admin can reject with a reason
- Any party can add comments to a ticket

### 5. Notifications
- `NotificationService` creates notifications on booking status changes and ticket updates
- Users fetch their notifications via `GET /api/notifications`

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/auth/google` | Public (OAuth2 redirect) |

### Resources
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/resources` | All |
| POST | `/api/resources` | Admin / Manager |
| PUT | `/api/resources/{id}` | Admin / Manager |
| DELETE | `/api/resources/{id}` | Admin / Manager |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/bookings` | User |
| GET | `/api/bookings` | Admin / Manager |
| GET | `/api/bookings/my` | User |
| GET | `/api/bookings/{id}` | Authenticated |
| PATCH | `/api/bookings/{id}/status` | Admin / Manager |
| PUT | `/api/bookings/{id}/approve` | Admin / Manager |
| PUT | `/api/bookings/{id}/reject` | Admin / Manager |
| PATCH | `/api/bookings/{id}/cancel` | User |
| DELETE | `/api/bookings/{id}` | Admin / Manager |

### Tickets
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/tickets` | Role-filtered |
| GET | `/api/tickets/{id}` | Authenticated |
| POST | `/api/tickets` | User |
| PUT | `/api/tickets/{id}` | Admin |
| PUT | `/api/tickets/{id}/status` | Technician / Admin |
| PUT | `/api/tickets/{id}/assign` | Admin / Manager |
| POST | `/api/tickets/{id}/comments` | Authenticated |
| DELETE | `/api/tickets/{id}` | Admin |
| GET | `/api/tickets/technicians` | Admin / Manager |

### Notifications
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/notifications` | Authenticated |

---

## Frontend Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | User Dashboard |
| `/bookings` | My Bookings |
| `/bookings/create` | Create Booking |
| `/tickets` | Ticket List |
| `/tickets/create` | Create Ticket |
| `/tickets/:id` | Ticket Details |
| `/notifications` | Notifications |
| `/resources` | Resource Management (Admin) |
| `/user/resources` | Browse Resources (User) |
| `/admin` | Admin Panel |
| `/admin/bookings` | Booking Requests |
| `/admin/users` | User Management |

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

### 1. Database Setup
Make sure MySQL is running on port `3306`. The database `paf` will be created automatically on first boot (`createDatabaseIfNotExist=true`).

Verify your credentials match `application.yml`:
```
username: root
password: 12345678
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
API will be available at `http://localhost:8081`

Swagger UI: `http://localhost:8081/swagger-ui/index.html`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
App will be available at `http://localhost:3000`

### 4. Google OAuth2 (optional)
Set the following environment variables before starting the backend:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |

---

## Swagger / API Docs

Once the backend is running, visit:
```
http://localhost:8081/swagger-ui/index.html
```

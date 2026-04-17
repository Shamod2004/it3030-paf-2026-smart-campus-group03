# MaintainInsicetTicket Admin Dashboard

A comprehensive admin dashboard for ticket management system built with React and Spring Boot.

## 🎯 Features

- **Admin Dashboard** with complete UI matching the design specifications
- **Stats Cards** showing ticket metrics (Total, Open, In Progress, Resolved, Rejected)
- **Interactive Charts** (Donut chart for status distribution, Bar chart for priority distribution)
- **Ticket Management Table** with all required columns and actions
- **Responsive Design** using Tailwind CSS
- **Real-time Data** integration with Spring Boot backend
- **MongoDB** database integration

## 🏗️ Architecture

### Frontend (React)
- **React 19** with functional components
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API calls

### Backend (Spring Boot)
- **Spring Boot 4.0.5**
- **MongoDB** with Spring Data MongoDB
- **RESTful APIs** for ticket management
- **Lombok** for boilerplate reduction
- **CORS** configuration for frontend integration

## 📋 Prerequisites

- **Java 17+**
- **Node.js 16+**
- **MongoDB** (running on localhost:27017)
- **Maven** 3.6+

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd maintainInsicetticket

# Build and run the Spring Boot application
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

### 3. Database Setup

Make sure MongoDB is running on localhost:27017. The application will automatically:
- Create a database named `maintainInsicetticket`
- Create a `tickets` collection
- Seed sample data on first startup

## 📊 API Endpoints

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket
- `GET /api/tickets/status/{status}` - Get tickets by status
- `GET /api/tickets/priority/{priority}` - Get tickets by priority

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI Components

### AdminDashboard
- Main dashboard container with sidebar and top bar
- Responsive sidebar with navigation menu
- Search functionality
- User profile section

### StatsCards
- Five stat cards showing ticket metrics
- Color-coded icons and backgrounds
- Hover effects and animations

### ChartsSection
- **Donut Chart**: Ticket status distribution with percentages
- **Bar Chart**: Ticket priority distribution
- Interactive tooltips and legends

### TicketTable
- Complete table with all required columns
- Color-coded status and priority badges
- Action buttons (View, Edit, Delete)
- Responsive horizontal scrolling
- Loading states and empty states

## 🎯 Color Scheme

- **Blue**: Primary color, Open status
- **Green**: Resolved status, Low priority
- **Orange**: In Progress status, Medium priority
- **Red**: Critical/High priority, Rejected status
- **Gray**: Neutral elements

## 📱 Responsive Design

- **Desktop**: Full sidebar, horizontal layouts
- **Tablet**: Collapsible sidebar, adjusted grid layouts
- **Mobile**: Hamburger menu, stacked layouts

## 🔧 Configuration

### Backend Configuration
Edit `src/main/resources/application.properties`:
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/maintainInsicetticket

# Server Configuration
server.port=8080

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration
Edit `package.json` for dependency versions and scripts.

## 🧪 Testing

### Backend Tests
```bash
cd maintainInsicetticket
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Sample Data

The application automatically seeds sample tickets on first startup including:
- Various ticket categories (Electrical, Network, Furniture, etc.)
- Different priorities (Low, Medium, High, Critical)
- Multiple statuses (Open, In Progress, Resolved, Rejected)
- Realistic ticket descriptions and metadata

## 🚀 Deployment

### Backend (JAR)
```bash
mvn clean package
java -jar target/maintainInsicetticket-0.0.1-SNAPSHOT.jar
```

### Frontend (Build)
```bash
npm run build
# Deploy the build/ folder to your web server
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on localhost:27017
   - Check database name in application.properties

2. **CORS Issues**
   - Verify frontend URL in CORS configuration
   - Check browser console for CORS errors

3. **Missing Dependencies**
   - Run `npm install` in frontend directory
   - Run `mvn clean install` in backend directory

4. **Port Conflicts**
   - Change server.port in application.properties
   - Update API calls in frontend if port changes

## 📞 Support

For issues and questions, please check the console logs for detailed error messages.

## 🔄 Development Workflow

1. Start MongoDB
2. Start backend server (port 8080)
3. Start frontend server (port 3000)
4. Access dashboard at http://localhost:3000
5. Make changes and reload browser

---

**Built with ❤️ using React, Spring Boot, and MongoDB**

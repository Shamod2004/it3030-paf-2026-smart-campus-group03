import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/booking.css";
import CreateBookingPage from "./pages/CreateBookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingPage from "./pages/AdminBookingPage";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";

function App() {
  // Allow user to input any email
  const [userEmail, setUserEmail] = useState("testuser@example.com");

  return (
    <Router>
      <div className="app-gradient-bg">
        <Navbar />
        <div className="main-content" style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 60px)" }}>
          <Sidebar />
          <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Routes>
              <Route path="/" element={<CreateBookingPage defaultEmail={userEmail} />} />
              <Route path="/my-bookings" element={<MyBookingsPage userEmail={userEmail} />} />
              <Route path="/admin-bookings" element={<AdminBookingPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

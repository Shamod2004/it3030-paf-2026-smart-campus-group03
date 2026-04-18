import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";

import CreateBookingPage from "./pages/CreateBookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingPage from "./pages/AdminBookingPage";

import "./styles/booking.css";

function App() {
  const [userEmail] = useState("testuser@example.com");

  return (
    <Router>
      <div className="app-layout">

        <Navbar />

        <div className="app-body">
          <Sidebar />

          <div className="app-content">
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
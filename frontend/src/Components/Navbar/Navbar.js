import React from "react";
import { FaUniversity } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => (
  <nav className="navbar-glass">
    <div className="navbar-logo">
      <FaUniversity size={28} />
      <span>Smart Campus Booking</span>
    </div>
  </nav>
);

export default Navbar;

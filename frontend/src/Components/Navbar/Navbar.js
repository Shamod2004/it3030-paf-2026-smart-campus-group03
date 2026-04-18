import React from "react";
import { FaUniversity } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-left">
        <FaUniversity />
        Smart Campus Booking
      </div>

      <div className="nav-center">
        <input placeholder="Search..." />
      </div>

      <div className="nav-right">
        <div className="avatar">S</div>
      </div>
    </div>
  );
};

export default Navbar;
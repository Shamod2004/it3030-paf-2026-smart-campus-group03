import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlus, FaList, FaUserShield } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">

      <NavLink to="/" className="menu">
        {({ isActive }) => (
          <div className={`menu-item ${isActive ? "active" : ""}`}>
            <FaPlus /> Create Booking
            <span className="indicator" />
          </div>
        )}
      </NavLink>

      <NavLink to="/my-bookings" className="menu">
        {({ isActive }) => (
          <div className={`menu-item ${isActive ? "active" : ""}`}>
            <FaList /> My Bookings
            <span className="indicator" />
          </div>
        )}
      </NavLink>

      <NavLink to="/admin-bookings" className="menu">
        {({ isActive }) => (
          <div className={`menu-item ${isActive ? "active" : ""}`}>
            <FaUserShield /> Admin Panel
            <span className="indicator" />
          </div>
        )}
      </NavLink>

    </div>
  );
};

export default Sidebar;
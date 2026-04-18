import React from "react";
import { FaPlus, FaList, FaUserShield } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => (
  <aside className="sidebar-glass">
    <NavLink to="/" className="sidebar-link">
      <FaPlus /> Create Booking
    </NavLink>
    <NavLink to="/my-bookings" className="sidebar-link">
      <FaList /> My Bookings
    </NavLink>
    <NavLink to="/admin-bookings" className="sidebar-link">
      <FaUserShield /> Admin Panel
    </NavLink>
  </aside>
);

export default Sidebar;

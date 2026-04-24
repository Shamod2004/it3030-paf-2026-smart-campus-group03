import React, { useState } from 'react';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import '../styles/Navbar.css';

const Navbar = ({ isUserPanel = false }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState(isUserPanel ? 1 : 3);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">🏫</div>
          <span className="logo-text">Smart Campus</span>
          {isUserPanel && <span className="user-badge">Student Portal</span>}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Notifications */}
          <div className="notification-icon">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="profile-section">
            <div
              className="profile-menu"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                  alt="User"
                />
              </div>
          <span className="username">{user?.name || (isUserPanel ? 'Student' : 'Admin User')}</span>
              <ChevronDown size={16} />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <User size={16} />
                  <span>Profile</span>
                </div>
                <div className="dropdown-item">Settings</div>
                <div className="dropdown-item">Help</div>
                <div className="dropdown-divider"></div>
                <div
                  className="dropdown-item logout"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

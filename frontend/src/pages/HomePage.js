import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Users, Shield, Zap, BarChart3, Calendar } from 'lucide-react';
import '../styles/HomePage.css';

const HomePage = () => {

  return (
    <div className="home-page">
      {/* Header Section */}
      <div className="home-header">
        <div className="header-content">
          <h1>Smart Campus</h1>
          <p>Resource Management & Booking System</p>
        </div>
        <div className="header-icon">🏫</div>
      </div>

      {/* Portal Selection Section */}
      <div className="portal-selector">
        <div className="selector-header">
          <h2>Select Your Portal</h2>
          <p>Choose to continue as Admin or Student</p>
        </div>

        <div className="portal-cards-container">
          {/* Admin Portal Card */}
          <div className="portal-card admin-card">
            <div className="card-header admin-header">
              <Shield size={40} />
              <h3>Admin Portal</h3>
            </div>

            <div className="card-content">
              <p className="card-description">
                Manage and monitor all campus resources, view bookings, and generate reports
              </p>

              <ul className="features-list">
                <li>
                  <BarChart3 size={16} />
                  <span>Resource Management</span>
                </li>
                <li>
                  <Users size={16} />
                  <span>User Management</span>
                </li>
                <li>
                  <Calendar size={16} />
                  <span>Booking Analytics</span>
                </li>
              </ul>

              <Link to="/admin/resources" className="btn-portal admin-btn">
                <LogIn size={18} />
                Go to Admin Panel
              </Link>
            </div>

            <div className="card-footer">
              <small>Administrator Access Required</small>
            </div>
          </div>

          {/* User Portal Card */}
          <div className="portal-card user-card">
            <div className="card-header user-header">
              <Zap size={40} />
              <h3>Student Portal</h3>
            </div>

            <div className="card-content">
              <p className="card-description">
                Browse available resources and make instant bookings for your study needs
              </p>

              <ul className="features-list">
                <li>
                  <Zap size={16} />
                  <span>Quick Booking</span>
                </li>
                <li>
                  <Calendar size={16} />
                  <span>Manage Reservations</span>
                </li>
                <li>
                  <Users size={16} />
                  <span>Find Resources</span>
                </li>
              </ul>

              <Link to="/user/dashboard" className="btn-portal user-btn">
                <LogIn size={18} />
                Enter Student Portal
              </Link>
            </div>

            <div className="card-footer">
              <small>Student Access</small>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="home-footer">
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">📚</div>
            <h4>Easy to Use</h4>
            <p>Simple and intuitive interface for seamless bookings</p>
          </div>
          <div className="info-item">
            <div className="info-icon">⚡</div>
            <h4>Fast Bookings</h4>
            <p>Book resources in minutes, anytime, anywhere</p>
          </div>
          <div className="info-item">
            <div className="info-icon">📊</div>
            <h4>Real-time Data</h4>
            <p>Live availability and comprehensive analytics</p>
          </div>
        </div>

        <div className="footer-text">
          <p>&copy; 2026 Smart Campus. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

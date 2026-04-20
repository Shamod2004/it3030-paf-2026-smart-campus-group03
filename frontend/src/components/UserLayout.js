import React from 'react';
import Navbar from './Navbar';
import UserSidebar from './UserSidebar';
import '../styles/UserLayout.css';

const UserLayout = ({ children, activeMenu = 'dashboard' }) => {
  return (
    <div className="user-layout">
      {/* Navigation Bar */}
      <Navbar isUserPanel={true} />

      <div className="layout-container">
        {/* Sidebar - Simplified for Users */}
        <UserSidebar activeMenu={activeMenu} />

        {/* Main Content */}
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

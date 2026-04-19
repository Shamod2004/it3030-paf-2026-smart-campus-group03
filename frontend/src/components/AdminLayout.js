import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/AdminLayout.css';

const AdminLayout = ({ children, activeMenu = 'resources' }) => {
  return (
    <div className="admin-layout">
      {/* Navigation Bar */}
      <Navbar />

      <div className="layout-container">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} />

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

export default AdminLayout;

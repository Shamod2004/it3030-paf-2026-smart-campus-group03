import React from 'react';
import { Home, Box, Calendar, HelpCircle, ChevronRight } from 'lucide-react';
import '../styles/UserSidebar.css';

const UserSidebar = ({ activeMenu = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/user/dashboard' },
    { id: 'resources', label: 'Resources', icon: Box, href: '/user/resources' },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, href: '/user/bookings' },
    { id: 'help', label: 'Help', icon: HelpCircle, href: '/user/help' },
  ];

  return (
    <aside className="user-sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span className="nav-label">{item.label}</span>
              {activeMenu === item.id && <ChevronRight size={18} className="nav-indicator" />}
            </a>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer - Helpful Info */}
      <div className="sidebar-footer">
        <div className="footer-card">
          <h4>💡 Quick Tip</h4>
          <p>Book resources up to 30 days in advance for better availability</p>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;

import React from 'react';
import { Home, Box, Calendar, Ticket, Users, BarChart3, ChevronRight } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeMenu = 'resources' }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { id: 'resources', label: 'Resources', icon: Box, href: '/admin/resources', active: true },
    { id: 'bookings', label: 'Bookings', icon: Calendar, href: '/admin/bookings' },
    { id: 'tickets', label: 'Tickets', icon: Ticket, href: '/admin/tickets' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  ];

  return (
    <aside className="sidebar">
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

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-card">
          <h4>Need Help?</h4>
          <p>Check our documentation</p>
          <button className="help-button">View Docs</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

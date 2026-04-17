import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Ticket, Bell, UserCircle, Home, Menu, X, Plus, Search, Database, Calendar } from 'lucide-react';
import TicketPage from './TicketPage';
import CreateTicketPage from './CreateTicketPage';

const StudentDashboard = ({ onSwitchRole }) => {
  const [activeMenuItem, setActiveMenuItem] = useState('tickets');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Ticket, label: 'My Tickets', id: 'tickets' },
    { icon: Plus, label: 'New Ticket', id: 'create-ticket' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: UserCircle, label: 'Profile', id: 'profile' },
    { icon: Database, label: 'Resources', id: 'resources' },
    { icon: Calendar, label: 'Bookings', id: 'bookings' },
  ];

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/dashboard/tickets');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTickets(data);
      localStorage.setItem('tickets', JSON.stringify(data));
    } catch {
      const saved = localStorage.getItem('tickets');
      if (saved) setTickets(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleNewTicket = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleMenuClick = (id) => {
    setActiveMenuItem(id);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Student</h1>
            <p className="text-gray-500 mb-6">Track and manage your maintenance tickets</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', value: tickets.length, color: 'bg-blue-50 text-blue-700' },
                { label: 'Open', value: tickets.filter(t => t.status === 'OPEN').length, color: 'bg-yellow-50 text-yellow-700' },
                { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'bg-orange-50 text-orange-700' },
                { label: 'Resolved', value: tickets.filter(t => t.status === 'RESOLVED').length, color: 'bg-green-50 text-green-700' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveMenuItem('create-ticket')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" /> Submit New Ticket
            </button>
          </div>
        );
      case 'tickets':
        return <TicketPage onNavigate={handleMenuClick} tickets={tickets} onNewTicket={handleNewTicket} loading={loading} />;
      case 'create-ticket':
        return <CreateTicketPage onNavigate={handleMenuClick} onNewTicket={handleNewTicket} />;
      case 'notifications':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">No notifications yet.</div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">Profile management coming soon.</div>
          </div>
        );
      case 'resources':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Resources</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">Resources management coming soon.</div>
          </div>
        );
      case 'bookings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bookings</h1>
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">Bookings management coming soon.</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-60'}
        w-64 bg-gray-50 h-full flex flex-col border-r border-gray-200
      `}>
        {/* Logo */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">Smart Campus</p>
                <p className="text-xs text-gray-500">Student Portal</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex text-gray-400 hover:text-gray-600">
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center px-3 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all
                ${activeMenuItem === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Switch to Admin */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={onSwitchRole}
              className="w-full text-xs text-gray-400 hover:text-blue-600 transition-colors text-left"
            >
              Switch to Admin View →
            </button>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

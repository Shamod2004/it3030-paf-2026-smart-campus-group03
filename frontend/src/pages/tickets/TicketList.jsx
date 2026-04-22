import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './tickets.css';

const TicketList = ({ tickets, title, user }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'OPEN': return 'badge badge-open';
      case 'IN_PROGRESS': return 'badge badge-progress';
      case 'RESOLVED': return 'badge badge-resolved';
      case 'CLOSED': return 'badge badge-closed';
      case 'REJECTED': return 'badge badge-rejected';
      default: return 'badge badge-closed';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
        case 'URGENT': return 'priority-urgent';
        case 'HIGH': return 'priority-high';
        case 'MEDIUM': return 'priority-medium';
        default: return 'priority-low';
    }
  };

  const statusOptions = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'];

  return (
    <div>
      {/* Header Section */}
      <div className="ticket-header">
        <div>
          <h2 className="ticket-header-title">{title}</h2>
          <p className="ticket-header-sub">Manage and track all campus incident reports</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => navigate('/tickets/new')}>
            + New Ticket
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ticket-filter-bar">
        {statusOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`filter-btn ${filter === opt ? 'active' : ''}`}
          >
            {opt.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Grid Section */}
      <div className="ticket-grid">
        {filteredTickets.length === 0 ? (
          <div className="ticket-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
             <h3 style={{ margin: 0, color: '#fff' }}>No tickets found</h3>
             <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Try selecting a different filter or create a new ticket.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="ticket-card interactive"
            >
              <div className="card-top">
                <span className={getBadgeClass(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`badge ${getPriorityClass(ticket.priority)}`} style={{ background: 'transparent' }}>
                  {ticket.priority}
                </span>
              </div>

              <div>
                <h3 className="card-title">
                  {ticket.title}
                </h3>
                <p className="card-desc">
                  {ticket.description}
                </p>
              </div>

              <div className="card-meta">
                <span>{ticket.resourceLocation}</span>
                <span>{ticket.category}</span>
              </div>

              <div className="card-meta" style={{ marginTop: 0, border: 'none', paddingTop: 0 }}>
                <span>{ticket.creator?.name || 'User'}</span>
                <span>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;

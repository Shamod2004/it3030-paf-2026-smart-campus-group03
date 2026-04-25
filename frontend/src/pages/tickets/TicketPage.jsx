import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';
import TicketList from './TicketList';
import useAuth from '../../hooks/useAuth';
import './tickets.css';

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await ticketService.getAllTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '3rem', color: '#f87171' }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchTickets} style={{ marginTop: '1rem' }}>
          Retry Connection
        </button>
      </div>
    );
  }

  const pageTitle = user?.role === 'ADMIN' ? 'All Incident Tickets' : 
                   user?.role === 'TECHNICIAN' ? 'Assigned Tickets' : 'My Support Tickets';

  return (
    <div className="ticket-container">
      <TicketList tickets={tickets} title={pageTitle} user={user} />
    </div>
  );
};

export default TicketPage;

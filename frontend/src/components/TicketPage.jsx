import React, { useState, useEffect } from 'react';
import TicketCardsPanel from './TicketCardsPanel';
import './TicketPage.css';

const TicketPage = ({ onNavigate, tickets: propTickets, onNewTicket }) => {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Handle ticket updates
  const handleTicketUpdate = (updatedTicket) => {
    console.log('?? [TICKET_PAGE] Ticket updated:', updatedTicket);
    // Since tickets are passed as props from AdminDashboard, we need to call a callback
    // to update the parent state. For now, we'll use the onNewTicket callback as a workaround
    if (onNewTicket && typeof onNewTicket === 'function') {
      // Use onNewTicket to notify parent of the update
      onNewTicket(updatedTicket);
    }
  };

  // Use tickets from props instead of local state
  const tickets = propTickets || [];

  useEffect(() => {
    // Remove local fetch since tickets are managed by AdminDashboard
    setLoading(false);
  }, [propTickets]);

  // Filter tickets
  const getFilteredTickets = () => {
    let filtered = [...tickets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.ticketId?.toLowerCase().includes(searchLower) ||
          ticket.title?.toLowerCase().includes(searchLower) ||
          ticket.description?.toLowerCase().includes(searchLower) ||
          ticket.relatedResource?.toLowerCase().includes(searchLower) ||
          ticket.priority?.toLowerCase().includes(searchLower) ||
          ticket.status?.toLowerCase().includes(searchLower) ||
          ticket.assignedTechnician?.toLowerCase().includes(searchLower) ||
          ticket.createdDate?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(ticket => {
        const ticketDate = ticket.createdDate?.split('T')[0];
        return ticketDate === dateFilter;
      });
    }

    return filtered;
  };

  const handleCreateTicket = () => {
    if (onNavigate) {
      onNavigate('create-ticket');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
            <p className="text-gray-600 mt-1">Manage and track support tickets</p>
          </div>
          <button
            onClick={handleCreateTicket}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Ticket
          </button>
        </div>

        {/* Filter & Sort Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tickets..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ticket Display Cards */}
        <div>
          <TicketCardsPanel 
            tickets={getFilteredTickets()} 
            loading={loading}
            onTicketUpdate={handleTicketUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketPage;

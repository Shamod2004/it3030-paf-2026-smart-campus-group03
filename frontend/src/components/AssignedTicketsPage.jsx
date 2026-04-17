import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, Edit } from 'lucide-react';
import UpdateStatusModal from './UpdateStatusModal';
import TicketDetailsModal from './TicketDetailsModal';

const PAGE_SIZE = 10;

const priorityBadge = (priority) => {
  const map = {
    HIGH: 'bg-red-50 text-red-700 border border-red-200',
    MEDIUM: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    LOW: 'bg-gray-50 text-gray-600 border border-gray-200',
    CRITICAL: 'bg-red-100 text-red-800 border border-red-300',
  };
  return map[priority?.toUpperCase()] || 'bg-gray-100 text-gray-600 border border-gray-200';
};

const statusBadge = (status) => {
  const map = {
    OPEN: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium',
    IN_PROGRESS: 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium',
    RESOLVED: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium',
    CLOSED: 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium',
    REJECTED: 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium',
  };
  return map[status?.toUpperCase()] || 'bg-gray-100 text-gray-600 border border-gray-200';
};

const fmt = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const AssignedTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [updateModal, setUpdateModal] = useState({ open: false, ticket: null });
  const [detailsModal, setDetailsModal] = useState({ open: false, ticket: null });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/dashboard/tickets');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTickets(data);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  // Apply filters
  const filtered = tickets.filter(t => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (dateFilter) {
      const ticketDate = new Date(t.createdDate).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      if (ticketDate !== filterDate) return false;
    }
    return true;
  }).sort((a, b) => {
    // Sort by Ticket ID in ascending order
    const ticketIdA = a.ticketId || '';
    const ticketIdB = b.ticketId || '';
    return ticketIdA.localeCompare(ticketIdB);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
    setShowDatePicker(false);
    setPage(1);
  };

  const clearDateFilter = () => {
    setDateFilter('');
    setShowDatePicker(false);
    setPage(1);
  };

  const handleUpdated = (updatedTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSuccessMsg('Ticket status updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assigned Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and track assigned support tickets</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={handleFilterChange(setPriorityFilter)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
          >
            <option value="">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Date picker */}
          <div className="relative date-picker-container">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded-lg px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{dateFilter ? new Date(dateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'All Dates'}</span>
            </button>
            
            {/* Date picker dropdown */}
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => handleDateFilterChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  {dateFilter && (
                    <button
                      onClick={clearDateFilter}
                      className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center">
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Ticket ID', 'Title', 'Resource', 'Priority', 'Status', 'Reported By', 'Assigned Date', 'Actions'].map((h, index) => (
                  <th key={`header-${index}`} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-row-${i}`}>
                    {[...Array(8)].map((_, j) => (
                      <td key={`skeleton-row-${i}-cell-${j}`} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-gray-400 text-lg mb-2">No tickets available</div>
                      <div className="text-gray-400 text-sm">Tickets will appear here when assigned</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((ticket, index) => (
                  <tr 
                    key={`ticket-${ticket.id}-${ticket.ticketId}`} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {ticket.ticketId || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px]">
                      <div className="truncate" title={ticket.title}>
                        {ticket.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {ticket.category || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center ${statusBadge(ticket.status)}`}>
                        {ticket.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {ticket.submittedBy || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {fmt(ticket.createdDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailsModal({ open: true, ticket })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open
                        </button>
                        <button
                          onClick={() => setUpdateModal({ open: true, ticket })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} tickets`}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={updateModal.open}
        ticket={updateModal.ticket}
        onClose={() => setUpdateModal({ open: false, ticket: null })}
        onUpdated={handleUpdated}
      />

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={detailsModal.open}
        ticket={detailsModal.ticket}
        onClose={() => setDetailsModal({ open: false, ticket: null })}
      />
    </div>
  );
};

export default AssignedTicketsPage;

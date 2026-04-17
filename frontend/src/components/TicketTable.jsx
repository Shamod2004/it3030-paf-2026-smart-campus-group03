import React from 'react';
import PropTypes from 'prop-types';
import { Eye, UserPlus, XCircle, Share2 } from 'lucide-react';
import './TicketTable.css';

const TicketTable = ({ 
  tickets = [], 
  loading = false, 
  cancelLoading = {},
  onView = () => {}, 
  onAssign = () => {},
  onCancel = () => {},
  onShare = () => {},
  getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, 
  getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Scrollable Loading Container */}
        <div className="max-h-[350px] overflow-y-auto ticket-table-container">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Sticky Loading Header */}
              <thead className="bg-gray-50 sticky top-0 z-20 ticket-table-header">
                <tr>
                  {[...Array(9)].map((_, index) => (
                    <th key={`header-${index}`} className="px-6 py-3 text-left">
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, index) => (
                  <tr key={`row-${index}`}>
                    {[...Array(9)].map((_, cellIndex) => (
                      <td key={`row-${index}-cell-${cellIndex}`} className="px-6 py-4">
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Ticket Management</h3>
      </div>
      
      {/* Scrollable Table Container */}
      <div className="max-h-[350px] overflow-y-auto ticket-table-container">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Sticky Table Header */}
            <thead className="bg-gray-50 sticky top-0 z-20 ticket-table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr 
                  key={`ticket-${ticket.id}-${ticket.ticketId}`} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.ticketId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.submittedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.assignedTechnician || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(ticket.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      {/* View Button */}
                      <button
                        onClick={() => onView(ticket.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150 cursor-pointer"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Assign Button */}
                      <button
                        onClick={() => onAssign(ticket.id)}
                        className="text-purple-600 hover:text-purple-800 transition-colors duration-150 cursor-pointer"
                        title="Assign"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      
                      {/* Cancel Button */}
                      <button
                        onClick={() => onCancel(ticket.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancel"
                        disabled={cancelLoading[ticket.id]}
                      >
                        {cancelLoading[ticket.id] ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                      
                      {/* Share Button */}
                      <button
                        onClick={() => onShare(ticket.id)}
                        className="text-green-600 hover:text-green-800 transition-colors duration-150 cursor-pointer"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {tickets.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
          </div>
        </div>
      )}
    </div>
  );
};

TicketTable.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  cancelLoading: PropTypes.object,
  onView: PropTypes.func,
  onAssign: PropTypes.func,
  onCancel: PropTypes.func,
  onShare: PropTypes.func,
  getPriorityColor: PropTypes.func,
  getStatusColor: PropTypes.func
};

export default TicketTable;

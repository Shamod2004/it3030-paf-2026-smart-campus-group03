import React from 'react';
import PropTypes from 'prop-types';
import { X, Calendar, User, Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

const ViewTicketModal = ({ isOpen, onClose, ticket = null }) => {
  if (!isOpen || !ticket) return null;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Ticket ID</label>
                <p className="text-sm text-gray-900 font-medium">{ticket.ticketId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                <p className="text-sm text-gray-900">{ticket.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
                <p className="text-sm text-gray-900">{ticket.createdDate}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Title</h3>
            <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">{ticket.title}</p>
          </div>

          {/* People Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">People Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submitted By */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Submitted By</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-blue-900 font-medium">{ticket.submittedBy}</p>
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span>{ticket.submittedBy?.toLowerCase().replace(' ', '.')}@smartcampus.edu</span>
                  </div>
                </div>
              </div>

              {/* Assigned Technician */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Assigned Technician</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-green-900 font-medium">
                    {ticket.assignedTechnician || 'Unassigned'}
                  </p>
                  {ticket.assignedTechnician && ticket.assignedTechnician !== 'Unassigned' && (
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <Phone className="w-4 h-4" />
                      <span>Contact: Available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ticket Created</p>
                  <p className="text-sm text-gray-500">{ticket.createdDate}</p>
                </div>
              </div>
              
              {ticket.status === 'IN_PROGRESS' && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Work in Progress</p>
                    <p className="text-sm text-gray-500">Technician is working on this issue</p>
                  </div>
                </div>
              )}

              {ticket.status === 'RESOLVED' && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Issue Resolved</p>
                    <p className="text-sm text-gray-500">Ticket has been successfully resolved</p>
                  </div>
                </div>
              )}

              {ticket.status === 'REJECTED' && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Ticket Rejected</p>
                    <p className="text-sm text-gray-500">Ticket was rejected and closed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewTicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticket: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ticketId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    submittedBy: PropTypes.string.isRequired,
    assignedTechnician: PropTypes.string,
    createdDate: PropTypes.string.isRequired
  })
};

export default ViewTicketModal;

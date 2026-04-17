import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, User, Mail, Phone, Calendar } from 'lucide-react';

const AssignTicketModal = ({ 
  isOpen, 
  onClose, 
  ticket = null, 
  onAssign = null 
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock technicians data - in real app, this would come from API
  useEffect(() => {
    if (isOpen) {
      // Simulate fetching technicians from API
      const mockTechnicians = [
        { id: 1, name: 'John Smith', email: 'john.smith@smartcampus.edu', phone: '555-0101', specialization: 'Electrical' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah.j@smartcampus.edu', phone: '555-0102', specialization: 'Plumbing' },
        { id: 3, name: 'Mike Davis', email: 'mike.davis@smartcampus.edu', phone: '555-0103', specialization: 'HVAC' },
        { id: 4, name: 'Emily Brown', email: 'emily.b@smartcampus.edu', phone: '555-0104', specialization: 'General' },
        { id: 5, name: 'David Wilson', email: 'david.w@smartcampus.edu', phone: '555-0105', specialization: 'Electrical' }
      ];
      setTechnicians(mockTechnicians);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTechnician) {
      setError('Please select a technician');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Find technician details
      const technician = technicians.find(t => t.id === parseInt(selectedTechnician));
      
      // Simulate API call to assign ticket
      const assignmentData = {
        ticketId: ticket?.id,
        technicianId: selectedTechnician,
        technicianName: technician?.name || 'Unknown',
        notes: assignmentNotes,
        assignedAt: new Date().toISOString()
      };

      // In a real app, this would be an API call
      console.log('Assigning ticket:', assignmentData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the onAssign callback with the assignment data
      if (onAssign) {
        onAssign(assignmentData);
      }

      // Reset form and close modal
      setSelectedTechnician('');
      setAssignmentNotes('');
      onClose();
    } catch (err) {
      console.error('Error assigning ticket:', err);
      setError('Failed to assign ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTechnician('');
    setAssignmentNotes('');
    setError('');
    onClose();
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Ticket</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ticket Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Ticket Details</h3>
            <p className="text-sm text-gray-600">ID: {ticket.ticketId}</p>
            <p className="text-sm text-gray-600">Title: {ticket.title}</p>
            <p className="text-sm text-gray-600">Category: {ticket.category}</p>
            <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>
          </div>

          {/* Assignment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Technician Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Technician
              </label>
              <select
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} - {tech.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Technician Details */}
            {selectedTechnician && (
              <div className="p-4 bg-blue-50 rounded-lg">
                {(() => {
                  const tech = technicians.find(t => t.id === parseInt(selectedTechnician));
                  return tech ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{tech.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{tech.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Specialization: {tech.specialization}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Assignment Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Notes (Optional)
              </label>
              <textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about this assignment..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !selectedTechnician}
              >
                {loading ? 'Assigning...' : 'Assign Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AssignTicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticket: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ticketId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired
  }),
  onAssign: PropTypes.func
};

export default AssignTicketModal;

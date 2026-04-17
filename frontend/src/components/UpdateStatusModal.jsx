import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

const TECHNICIANS = [
  'Sarah K.', 'Tom Wilson', 'Robert Chen', 'Alex Kumar', 'Mike Davis',
  'Lisa Park', 'James Brown', 'Anna White'
];

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const UpdateStatusModal = ({ isOpen, onClose, ticket, onUpdated }) => {
  const [status, setStatus] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || 'OPEN');
      setRejectReason(ticket.rejectReason || '');
      setResolutionNotes(ticket.resolutionNotes || '');
      setAssignedTechnician(ticket.assignedTechnician || '');
      setError('');
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'REJECTED' && !rejectReason.trim()) {
      setError('Reject reason is required when status is REJECTED.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const body = { status, rejectReason, resolutionNotes, assignedTechnician };
      const res = await fetch(`http://localhost:8080/api/dashboard/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update ticket');
      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError('Failed to update ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Update Ticket Status</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Reject Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reject Reason{' '}
              <span className="text-gray-400 font-normal">(Required for Rejected)</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Please explain why this ticket is being rejected..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Resolution Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={4}
              placeholder="Add detailed notes about the resolution or status update..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Assign Technician */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Technician{' '}
              <span className="text-gray-400 font-normal">(Optional - Admin)</span>
            </label>
            <select
              value={assignedTechnician}
              onChange={(e) => setAssignedTechnician(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a technician...</option>
              {TECHNICIANS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              Save Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;

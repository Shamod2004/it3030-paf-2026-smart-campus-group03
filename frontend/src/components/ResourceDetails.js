import React, { useState } from 'react';
import { X, Trash2, Edit2, AlertCircle } from 'lucide-react';
import '../styles/ResourceDetails.css';

const ResourceDetails = ({ isOpen, onClose, resource, onEdit, onDelete, onStatusChange }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !resource) return null;

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: '#10B981',
      MAINTENANCE: '#F59E0B',
      INACTIVE: '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(resource.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusChange(resource.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="details-overlay">
      <div className="details-modal">
        {/* Header */}
        <div className="details-header">
          <div>
            <h2>{resource.name}</h2>
            <p className="resource-id">{resource.resourceId}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(resource.status) }}
          >
            {resource.status}
          </span>
          <div className="quick-actions">
            <button className="btn-icon" onClick={() => onEdit(resource)} title="Edit">
              <Edit2 size={18} />
            </button>
            <button
              className="btn-icon danger"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="details-content">
          {/* Main Image */}
          {resource.imageUrl && (
            <div className="resource-image">
              <img src={resource.imageUrl} alt={resource.name} />
            </div>
          )}

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-item">
              <label>Type</label>
              <span className="detail-value">{resource.type}</span>
            </div>
            <div className="detail-item">
              <label>Capacity</label>
              <span className="detail-value">{resource.capacity} people</span>
            </div>
            <div className="detail-item">
              <label>Location</label>
              <span className="detail-value">{resource.location}</span>
            </div>
            <div className="detail-item">
              <label>Total Bookings</label>
              <span className="detail-value">{resource.totalBookings || 0}</span>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="description-section">
              <h4>Description</h4>
              <p>{resource.description}</p>
            </div>
          )}

          {/* Dates */}
          <div className="dates-section">
            <div className="date-item">
              <label>Created</label>
              <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="date-item">
              <label>Last Updated</label>
              <span>{new Date(resource.updatedAt).toLocaleDateString()}</span>
            </div>
            {resource.lastUsedAt && (
              <div className="date-item">
                <label>Last Used</label>
                <span>{new Date(resource.lastUsedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Status Change */}
          <div className="status-change-section">
            <h4>Change Status</h4>
            <div className="status-buttons">
              {['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE', 'INACTIVE'].map((status) => (
                <button
                  key={status}
                  className={`status-btn ${resource.status === status ? 'active' : ''}`}
                  onClick={() => handleStatusChange(status)}
                  style={resource.status === status ? { backgroundColor: getStatusColor(status) } : {}}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="confirmation-dialog">
            <div className="confirmation-content">
              <AlertCircle size={48} color="#EF4444" />
              <h3>Delete Resource?</h3>
              <p>This action cannot be undone.</p>
              <div className="confirmation-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn-delete"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetails;

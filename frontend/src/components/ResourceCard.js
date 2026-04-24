import React from 'react';
import { MapPin, Users } from 'lucide-react';
import '../styles/ResourceCard.css';

const ResourceCard = ({ resource, onBookNow, onViewDetails }) => {
  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: { bg: '#10B981', text: '🟢 Available' },
      MAINTENANCE: { bg: '#F59E0B', text: '🔴 Maintenance' },
      INACTIVE: { bg: '#EF4444', text: '🔴 Unavailable' },
    };
    return colors[status] || { bg: '#6B7280', text: 'Unknown' };
  };

  const statusInfo = getStatusColor(resource.status);
  const isAvailable = resource.status === 'ACTIVE';

  return (
    <div className="resource-card">
      {/* Image Section */}
      <div className="card-image-wrapper">
        <img
          src={resource.imageUrl || 'https://via.placeholder.com/300x200?text=Resource'}
          alt={resource.name}
          className="card-image"
        />
        <span className="status-badge" style={{ backgroundColor: statusInfo.bg }}>
          {statusInfo.text}
        </span>
      </div>

      {/* Content Section */}
      <div className="card-body">
        <h3 className="card-title">{resource.name}</h3>

        <div className="card-meta">
          <span className="type-tag">{resource.type}</span>
        </div>

        <div className="card-info">
          <div className="info-item">
            <Users size={16} />
            <span>{resource.capacity} Capacity</span>
          </div>
          <div className="info-item">
            <MapPin size={16} />
            <span>{resource.location}</span>
          </div>
        </div>

        {resource.description && (
          <p className="card-description">{resource.description}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="card-actions">
        <button
          className="btn-secondary"
          onClick={() => onViewDetails(resource)}
        >
          View Details
        </button>
        <button
          className={`btn-primary ${!isAvailable ? 'disabled' : ''}`}
          onClick={() => onBookNow(resource)}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;

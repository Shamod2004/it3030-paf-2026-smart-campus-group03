import React from 'react';
import '../../styles/booking.css';
import { FaUser, FaCalendarAlt, FaClock, FaClipboardList } from 'react-icons/fa';

const MyBookingCard = ({ booking, onCancel }) => {
  return (
    <div className={`booking-card glass-card animate-card`}>
      <div className="booking-card-header">
        <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
      </div>
      <div className="booking-card-body">
        <div className="booking-info-row">
          <FaUser className="icon" />
          <span>{booking.userEmail}</span>
        </div>
        <div className="booking-info-row">
          <FaClipboardList className="icon" />
          <span>{booking.resourceName}</span>
        </div>
        <div className="booking-info-row">
          <FaCalendarAlt className="icon" />
          <span>{booking.date}</span>
        </div>
        <div className="booking-info-row">
          <FaClock className="icon" />
          <span>{booking.startTime} - {booking.endTime}</span>
        </div>
        <div className="booking-info-row">
          <span>Purpose: {booking.purpose}</span>
        </div>
        <div className="booking-info-row">
          <span>Attendees: {booking.attendees}</span>
        </div>
        {booking.adminReason && (
          <div className="booking-info-row">
            <span>Admin Reason: {booking.adminReason}</span>
          </div>
        )}
      </div>
      <div className="booking-card-actions">
        {booking.status === 'APPROVED' && (
          <button className="btn-cancel" onClick={() => onCancel(booking.id)}>Cancel</button>
        )}
      </div>
    </div>
  );
};

export default MyBookingCard;

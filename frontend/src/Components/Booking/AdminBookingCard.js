import React from 'react';
import '../../styles/booking.css';
import { FaUser, FaCalendarAlt, FaClock, FaClipboardList, FaCheck, FaTimes } from 'react-icons/fa';

const AdminBookingCard = ({ booking, onApprove, onReject }) => {
  return (
    <div className={`booking-card glass-card animate-card`}>
      <div className="booking-card-header">
        <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span>
        {booking.status === 'REJECTED' && booking.adminReason && (
          <span className="rejection-reason">Reason: {booking.adminReason}</span>
        )}
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
        {booking.adminReason && booking.status !== 'REJECTED' && (
          <div className="booking-info-row">
            <span>Admin Reason: {booking.adminReason}</span>
          </div>
        )}
      </div>
      <div className="booking-card-actions">
        {booking.status === 'PENDING' && (
          <>
            <button className="btn-approve" onClick={() => onApprove(booking.id)}><FaCheck /> Approve</button>
            <button className="btn-reject" onClick={() => onReject(booking.id)}><FaTimes /> Reject</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookingCard;

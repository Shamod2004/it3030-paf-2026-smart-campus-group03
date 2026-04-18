import React from 'react';
import '../../styles/booking.css';
import { FaUser, FaCalendarAlt, FaClock, FaClipboardList, FaCheck, FaTimes } from 'react-icons/fa';

const AdminBookingCard = ({ booking, onApprove, onReject }) => {
return (
  <div className="booking-card">

    {/* HEADER */}
    <div className="booking-card-header">

      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
        {booking.status}
      </span>

      {booking.status === 'REJECTED' && booking.adminReason && (
        <span style={{ fontSize: "12px", color: "#991b1b" }}>
          Reason: {booking.adminReason}
        </span>
      )}

    </div>

    {/* BODY */}
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
        Purpose: {booking.purpose}
      </div>

      <div className="booking-info-row">
        Attendees: {booking.attendees}
      </div>

    </div>

    {/* ACTIONS */}
    <div className="booking-card-actions">

      {booking.status === 'PENDING' && (
        <>
          <button className="btn-approve" onClick={() => onApprove(booking.id)}>
            <FaCheck /> Approve
          </button>

          <button className="btn-reject" onClick={() => onReject(booking.id)}>
            <FaTimes /> Reject
          </button>
        </>
      )}

    </div>

  </div>
);
};

export default AdminBookingCard;

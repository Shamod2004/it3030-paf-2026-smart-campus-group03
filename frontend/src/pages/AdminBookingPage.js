import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/api';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import '../styles/booking.css';
import { FaFilter, FaInbox } from 'react-icons/fa';
import AdminBookingCard from '../Components/Booking/AdminBookingCard';

const statusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [status]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let data = await getAllBookings();
      if (status !== 'ALL') {
        data = data.filter((b) => b.status === status);
      }
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateBookingStatus(id, 'APPROVED');
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: 'APPROVED' } : b)); // Optimistic update
    } catch {
      alert('Error occurred, try again');
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason) return;
    try {
      await updateBookingStatus(id, 'REJECTED', rejectReason);
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: 'REJECTED', rejectionReason: rejectReason } : b)); // Optimistic update
      setRejectId(null);
      setRejectReason('');
    } catch {
      alert('Error occurred, try again');
    }
  };

  return (
    <div className="booking-bg-gradient">
      <div className="booking-layout">
        <div className="bookings-list-container">
          <div className="bookings-list-header">
            <h2>All Bookings</h2>
            <div className="filter-dropdown">
              <FaFilter />
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div className="spinner-large"></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <FaInbox size={48} />
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="bookings-cards-list">
              {bookings.map(b => (
                <div key={b.id}>
                  <AdminBookingCard
                    booking={b}
                    onApprove={() => handleApprove(b.id)}
                    onReject={() => setRejectId(b.id)}
                  />
                  {rejectId === b.id && (
                    <div className="reject-popup glass-card">
                      <input
                        type="text"
                        placeholder="Rejection reason"
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                      />
                      <button className="btn-reject-confirm" onClick={() => handleReject(b.id)}>Confirm Reject</button>
                      <button className="btn-cancel-popup" onClick={() => setRejectId(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingPage;

import React, { useEffect, useState } from 'react';
import { getAllBookings, cancelBooking } from '../services/api';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import '../styles/booking.css';
import { FaFilter, FaInbox } from 'react-icons/fa';
import MyBookingCard from '../Components/Booking/MyBookingCard';

const statusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
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
                <MyBookingCard key={b.id} booking={b} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;

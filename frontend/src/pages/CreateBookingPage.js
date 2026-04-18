import React, { useState } from 'react';
import { createBooking } from '../services/api';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import '../styles/booking.css';
import { FaCalendarPlus, FaUserFriends, FaClock, FaClipboardList } from 'react-icons/fa';

const resources = [
  'Auditorium',
  'Conference Room',
  'Sports Hall',
  'Lab 1',
  'Lab 2',
];

const CreateBookingPage = () => {
  const [form, setForm] = useState({
    resourceName: '',
    userEmail: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setConflict('');
  };

  const validate = () => {
    if (!form.resourceName || !form.userEmail || !form.date || !form.startTime || !form.endTime || !form.purpose || !form.attendees) {
      setError('All fields are required.');
      return false;
    }
    if (form.startTime >= form.endTime) {
      setError('Start time must be before end time.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccess('');
    setError('');
    setConflict('');
    try {
      // Prepare payload with correct field names
      const payload = {
        resourceName: form.resourceName,
        userEmail: form.userEmail,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
        attendees: parseInt(form.attendees, 10),
      };
      await createBooking(payload);
      // Save the email to localStorage for MyBookingsPage
      localStorage.setItem('lastBookingEmail', form.userEmail);
      setSuccess('Booking created successfully!');
      setForm({ resourceName: '', userEmail: '', date: '', startTime: '', endTime: '', purpose: '', attendees: '' });
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.toLowerCase().includes('conflict')) {
          setConflict('Time conflict, please select another slot');
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError('Error occurred, try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-bg-gradient">
      <div className="booking-layout">
        <div className="booking-form-container glass-card">
          <h2><FaCalendarPlus /> Create Booking</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <label>Resource</label>
            <select name="resourceName" value={form.resourceName} onChange={handleChange}>
              <option value="">Select resource</option>
              {resources.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <label>Email</label>
            <input type="email" name="userEmail" value={form.userEmail} onChange={handleChange} placeholder="Your email" />
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
            <label>Start Time</label>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
            <label>End Time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
            <label>Purpose</label>
            <input type="text" name="purpose" value={form.purpose} onChange={handleChange} placeholder="Purpose" />
            <label>Attendees</label>
            <input type="number" name="attendees" value={form.attendees} onChange={handleChange} placeholder="Number of attendees" />
            {error && <div className="error-message">{error}</div>}
            {conflict && <div className="conflict-popup">{conflict}</div>}
            {success && <div className="success-message">{success}</div>}
            <button
              type="submit"
              className="btn-create-booking"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingPage;

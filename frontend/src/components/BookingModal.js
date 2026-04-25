import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import '../styles/BookingModal.css';

const BookingModal = ({ isOpen, onClose, resource, onConfirmBooking }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bookingDate) {
      setError('Please select a date');
      return;
    }

    if (!bookingTime) {
      setError('Please select a time slot');
      return;
    }

    setLoading(true);
    try {
      await onConfirmBooking({
        resourceId: resource.id,
        date: bookingDate,
        time: bookingTime,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setBookingDate('');
        setBookingTime('');
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !resource) return null;

  // Get today's date for min date picker
  const today = new Date().toISOString().split('T')[0];

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-header">
          <div>
            <h2>Book Resource</h2>
            <p className="resource-name">{resource.name}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <p>Booking Confirmed!</p>
            <span>Your reservation has been created successfully</span>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="booking-form">
            {/* Resource Info */}
            <div className="resource-info-section">
              <div className="info-grid">
                <div className="info-item-full">
                  <Users size={18} />
                  <span><strong>Capacity:</strong> {resource.capacity} people</span>
                </div>
                <div className="info-item-full">
                  <MapPin size={18} />
                  <span><strong>Location:</strong> {resource.location}</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Date Selection */}
            <div className="form-group">
              <label htmlFor="bookingDate">
                <Calendar size={18} />
                Select Date *
              </label>
              <input
                id="bookingDate"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={today}
                max={
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                }
                className="date-input"
              />
            </div>

            {/* Time Selection */}
            <div className="form-group">
              <label htmlFor="bookingTime">
                <Clock size={18} />
                Select Time Slot *
              </label>
              <select
                id="bookingTime"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="time-select"
              >
                <option value="">Choose a time...</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="booking-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>

            {/* Help Text */}
            <p className="help-text">
              💡 You can book resources up to 30 days in advance
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

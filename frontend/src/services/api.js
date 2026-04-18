import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a new booking
export const createBooking = async (data) => {
  try {
    const response = await api.post('/api/bookings', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get bookings for a user
export const getUserBookings = async (email) => {
  try {
    const response = await api.get(`/api/bookings/user/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all bookings (admin)
export const getAllBookings = async () => {
  try {
    const response = await api.get('/api/bookings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking status (approve/reject)
export const updateBookingStatus = async (id, status, reason = '') => {
  try {
    const payload = { status };
    if (reason) payload.rejectionReason = reason;
    const response = await api.put(`/api/bookings/${id}/status`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (id) => {
  try {
    const response = await api.put(`/api/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

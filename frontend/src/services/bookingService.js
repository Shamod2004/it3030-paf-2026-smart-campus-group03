import api from './axiosInstance'

const bookingService = {
  // POST /api/bookings
  createBooking: (data) => api.post('/bookings', data).then(r => r.data),

  // GET /api/bookings/my
  getMyBookings: () => api.get('/bookings/my').then(r => r.data),

  // GET /api/bookings  (ADMIN/MANAGER)
  getAllBookings: () => api.get('/bookings').then(r => r.data),

  // GET /api/bookings?status=PENDING
  getPendingBookings: () => api.get('/bookings', { params: { status: 'PENDING' } }).then(r => r.data),

  // GET /api/bookings/{id}
  getBookingById: (id) => api.get(`/bookings/${id}`).then(r => r.data),

  // PATCH /api/bookings/{id}/status  { status, reason }
  updateStatus: (id, status, reason = null) =>
    api.patch(`/bookings/${id}/status`, { status, reason }).then(r => r.data),

  // DELETE /api/bookings/{id}
  deleteBooking: (id) => api.delete(`/bookings/${id}`).then(r => r.data),

  // PATCH /api/bookings/{id}/cancel
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`).then(r => r.data),
}

export default bookingService

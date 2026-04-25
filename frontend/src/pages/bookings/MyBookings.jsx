import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import bookingService from '../../services/bookingService'

const STATUS_STYLE = {
  PENDING:   { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b',  label: '⏳ Pending' },
  APPROVED:  { bg: 'rgba(16,185,129,0.15)',  color: '#10b981',  label: '✅ Approved' },
  REJECTED:  { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444',  label: '❌ Rejected' },
  CANCELLED: { bg: 'rgba(100,116,139,0.15)', color: '#64748b',  label: '🚫 Cancelled' },
}

export default function MyBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  const load = () => {
    setLoading(true)
    bookingService.getMyBookings()
      .then(r => setBookings(r || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingService.cancelBooking(id)
      toast.success('Booking cancelled')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this booking')
    }
  }

  return (
    <div className="animate-fadeIn">
      <div style={s.header}>
        <div>
          <h1 style={s.title}>📋 My Bookings</h1>
          <p style={s.sub}>Track all your booking requests</p>
        </div>
        <button style={s.newBtn} onClick={() => navigate('/bookings/create')}>
          + New Booking
        </button>
      </div>

      {loading ? (
        <div style={s.center}><div style={s.spinner} /></div>
      ) : bookings.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 48 }}>📅</span>
          <p style={{ color: '#94a3b8', marginTop: 12 }}>No bookings yet</p>
          <button style={s.newBtn} onClick={() => navigate('/bookings/create')}>
            Create your first booking
          </button>
        </div>
      ) : (
        <div style={s.list}>
          {bookings.map(b => {
            const st = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING
            return (
              <div key={b.id} style={s.card}>
                <div style={s.cardTop}>
                  <div>
                    <p style={s.resourceName}>{b.resourceName}</p>
                    <p style={s.meta}>
                      📅 {b.date} &nbsp;·&nbsp; 🕐 {b.startTime} – {b.endTime}
                    </p>
                    <p style={s.meta}>👥 {b.attendees} attendees &nbsp;·&nbsp; 📝 {b.purpose}</p>
                    {b.adminReason && (
                      <p style={s.reason}>Reason: {b.adminReason}</p>
                    )}
                  </div>
                  <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                {b.status === 'APPROVED' && (
                  <div style={s.actions}>
                    <button style={s.cancelBtn} onClick={() => handleCancel(b.id)}>
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const s = {
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 },
  title:        { fontSize: 26, fontWeight: 800, marginBottom: 4 },
  sub:          { color: '#64748b', fontSize: 14 },
  newBtn:       { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  center:       { display: 'flex', justifyContent: 'center', padding: 60 },
  spinner:      { width: 40, height: 40, borderRadius: '50%', border: '3px solid #334155', borderTop: '3px solid #6366f1', animation: 'spin .8s linear infinite' },
  empty:        { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  list:         { display: 'flex', flexDirection: 'column', gap: 14 },
  card:         { background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '18px 20px' },
  cardTop:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' },
  resourceName: { fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 },
  meta:         { fontSize: 13, color: '#94a3b8', marginBottom: 3 },
  reason:       { fontSize: 13, color: '#f87171', marginTop: 6, fontStyle: 'italic' },
  statusBadge:  { padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0 },
  actions:      { marginTop: 14, paddingTop: 14, borderTop: '1px solid #334155' },
  cancelBtn:    { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: 8, padding: '7px 16px', fontSize: 13, cursor: 'pointer' },
}

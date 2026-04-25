import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import bookingService from '../../services/bookingService'

const STATUS_STYLE = {
  PENDING:   { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  APPROVED:  { bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
  REJECTED:  { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  CANCELLED: { bg: 'rgba(100,116,139,0.15)', color: '#64748b' },
}

export default function BookingRequests() {
  const [bookings,  setBookings]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('PENDING')
  const [rejectId,  setRejectId]  = useState(null)
  const [reason,    setReason]    = useState('')

  const load = () => {
    setLoading(true)
    bookingService.getAllBookings()
      .then(r => setBookings(r || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const handleApprove = async (id) => {
    try {
      await bookingService.updateStatus(id, 'APPROVED')
      toast.success('Booking approved')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) { toast.error('Please provide a rejection reason'); return }
    try {
      await bookingService.updateStatus(rejectId, 'REJECTED', reason)
      toast.success('Booking rejected')
      setRejectId(null)
      setReason('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    }
  }

  return (
    <div className="animate-fadeIn">
      <div style={s.header}>
        <div>
          <h1 style={s.title}>📋 Booking Requests</h1>
          <p style={s.sub}>Review and manage booking requests</p>
        </div>
        {/* Filter tabs */}
        <div style={s.tabs}>
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(f => (
            <button
              key={f}
              style={{ ...s.tab, ...(filter === f ? s.tabActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={s.center}><div style={s.spinner} /></div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 40 }}>📭</span>
          <p style={{ color: '#94a3b8', marginTop: 10 }}>No {filter.toLowerCase()} bookings</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map(b => {
            const st = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING
            return (
              <div key={b.id} style={s.card}>
                <div style={s.cardTop}>
                  <div style={{ flex: 1 }}>
                    <div style={s.cardHeader}>
                      <p style={s.resourceName}>{b.resourceName}</p>
                      <span style={{ ...s.badge, background: st.bg, color: st.color }}>{b.status}</span>
                    </div>
                    <p style={s.meta}>👤 {b.userName} &nbsp;·&nbsp; 📅 {b.date} &nbsp;·&nbsp; 🕐 {b.startTime} – {b.endTime}</p>
                    <p style={s.meta}>👥 {b.attendees} attendees &nbsp;·&nbsp; 📝 {b.purpose}</p>
                    {b.adminReason && <p style={s.reason}>Reason: {b.adminReason}</p>}
                  </div>
                </div>

                {b.status === 'PENDING' && (
                  <div style={s.actions}>
                    <button style={s.approveBtn} onClick={() => handleApprove(b.id)}>
                      ✅ Approve
                    </button>
                    <button style={s.rejectBtn} onClick={() => { setRejectId(b.id); setReason('') }}>
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ marginBottom: 16, color: '#e2e8f0' }}>Reject Booking</h3>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
              rows={4}
              style={s.textarea}
            />
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setRejectId(null)}>Cancel</button>
              <button style={s.rejectBtn} onClick={handleReject}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  title:        { fontSize: 26, fontWeight: 800, marginBottom: 4 },
  sub:          { color: '#64748b', fontSize: 14 },
  tabs:         { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tab:          { background: '#1e293b', border: '1px solid #334155', color: '#64748b', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  tabActive:    { background: 'rgba(99,102,241,0.2)', borderColor: '#6366f1', color: '#818cf8' },
  center:       { display: 'flex', justifyContent: 'center', padding: 60 },
  spinner:      { width: 40, height: 40, borderRadius: '50%', border: '3px solid #334155', borderTop: '3px solid #6366f1', animation: 'spin .8s linear infinite' },
  empty:        { textAlign: 'center', padding: '60px 20px' },
  list:         { display: 'flex', flexDirection: 'column', gap: 14 },
  card:         { background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '18px 20px' },
  cardTop:      { display: 'flex', gap: 12 },
  cardHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  resourceName: { fontSize: 16, fontWeight: 700, color: '#e2e8f0' },
  badge:        { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0 },
  meta:         { fontSize: 13, color: '#94a3b8', marginBottom: 3 },
  reason:       { fontSize: 13, color: '#f87171', marginTop: 4, fontStyle: 'italic' },
  actions:      { display: 'flex', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid #334155' },
  approveBtn:   { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  rejectBtn:    { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: 8, padding: '7px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  overlay:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 },
  modal:        { background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440 },
  textarea:     { background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, width: '100%', resize: 'vertical', fontFamily: 'inherit', marginBottom: 16 },
  modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end' },
  cancelBtn:    { background: '#273549', border: '1px solid #334155', color: '#94a3b8', borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: 'pointer' },
}

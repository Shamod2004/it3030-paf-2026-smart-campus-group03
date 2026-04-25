import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import resourceService from '../../services/resourceService'
import bookingService  from '../../services/bookingService'

export default function CreateBooking() {
  const { resourceId } = useParams()   // optional pre-fill
  const navigate = useNavigate()

  const [resources, setResources] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({
    resourceId: resourceId || '',
    date:       '',
    startTime:  '',
    endTime:    '',
    purpose:    '',
    attendees:  1,
  })

  useEffect(() => {
    resourceService.getAllResources(0, 100)
      .then(r => setResources((r.data || []).filter(res => res.status === 'ACTIVE')))
      .catch(() => {})
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.resourceId || !form.date || !form.startTime || !form.endTime || !form.purpose) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.startTime >= form.endTime) {
      toast.error('End time must be after start time')
      return
    }
    setLoading(true)
    try {
      await bookingService.createBooking({
        resourceId: Number(form.resourceId),
        date:       form.date,
        startTime:  form.startTime,
        endTime:    form.endTime,
        purpose:    form.purpose,
        attendees:  Number(form.attendees),
      })
      toast.success('Booking request submitted! Awaiting approval.')
      navigate('/bookings/my')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed — time slot may be taken')
    } finally {
      setLoading(false)
    }
  }

  const selectedResource = resources.find(r => String(r.id) === String(form.resourceId))

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 style={s.title}>📅 Create Booking</h1>
      <p style={s.sub}>Fill in the details to request a resource booking</p>

      <form onSubmit={handleSubmit} style={s.card}>
        {/* Resource selector */}
        <div style={s.field}>
          <label style={s.label}>Resource *</label>
          <select name="resourceId" value={form.resourceId} onChange={handleChange} style={s.input} required>
            <option value="">— Select a resource —</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.location} (cap: {r.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Resource info chip */}
        {selectedResource && (
          <div style={s.resourceChip}>
            <span>🏢</span>
            <span><strong>{selectedResource.name}</strong> · {selectedResource.location} · Capacity: {selectedResource.capacity}</span>
          </div>
        )}

        {/* Date */}
        <div style={s.field}>
          <label style={s.label}>Date *</label>
          <input
            type="date" name="date" value={form.date} onChange={handleChange}
            min={new Date().toISOString().split('T')[0]} style={s.input} required
          />
        </div>

        {/* Time row */}
        <div style={s.row}>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>Start Time *</label>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} style={s.input} required />
          </div>
          <div style={{ ...s.field, flex: 1 }}>
            <label style={s.label}>End Time *</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} style={s.input} required />
          </div>
        </div>

        {/* Purpose */}
        <div style={s.field}>
          <label style={s.label}>Purpose *</label>
          <textarea
            name="purpose" value={form.purpose} onChange={handleChange}
            placeholder="Describe the purpose of this booking..."
            rows={3} style={{ ...s.input, resize: 'vertical' }} required
          />
        </div>

        {/* Attendees */}
        <div style={s.field}>
          <label style={s.label}>Expected Attendees</label>
          <input
            type="number" name="attendees" value={form.attendees} onChange={handleChange}
            min={1} max={selectedResource?.capacity || 999} style={s.input}
          />
        </div>

        <button type="submit" style={s.submitBtn} disabled={loading}>
          {loading ? <span style={s.spinner} /> : '📤 Submit Booking Request'}
        </button>
      </form>
    </div>
  )
}

const s = {
  title:      { fontSize: 26, fontWeight: 800, marginBottom: 6 },
  sub:        { color: '#64748b', fontSize: 14, marginBottom: 28 },
  card:       { background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 },
  field:      { display: 'flex', flexDirection: 'column', gap: 6 },
  label:      { fontSize: 13, fontWeight: 600, color: '#94a3b8' },
  input:      { background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none', width: '100%', fontFamily: 'inherit' },
  row:        { display: 'flex', gap: 16 },
  resourceChip: { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#a5b4fc', display: 'flex', gap: 8, alignItems: 'center' },
  submitBtn:  { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none', color: '#fff', borderRadius: 11, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 15px rgba(99,102,241,0.4)' },
  spinner:    { width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin .7s linear infinite' },
}

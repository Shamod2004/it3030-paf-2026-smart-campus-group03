import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/axiosInstance'
import './tickets.css'

const CATEGORIES = [
  'Network/Wifi',
  'Projector/Display',
  'Air Conditioning',
  'Electrical',
  'Plumbing',
  'Furniture',
  'IT Equipment',
  'Security',
  'Cleaning',
  'Other',
]

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export default function TicketCreate() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    resourceLocation: '',
    priority: 'MEDIUM',
  })
  const [files, setFiles]       = useState([])
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.title.trim())              e.title = 'Title is required.'
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.'
    if (!form.category)                  e.category = 'Please select a category.'
    if (!form.description.trim())        e.description = 'Description is required.'
    else if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters.'
    if (!form.resourceLocation.trim())   e.resourceLocation = 'Location is required.'
    return e
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      toast.error('Please fix the highlighted errors.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('ticket', new Blob([JSON.stringify(form)], { type: 'application/json' }))
      files.forEach(f => formData.append('files', f))

      await api.post('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Ticket submitted successfully!')
      navigate('/tickets')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="ticket-container">
      {/* Header */}
      <div className="ticket-header">
        <div>
          <h1 className="ticket-header-title">🎫 New Support Ticket</h1>
          <p className="ticket-header-sub">Describe your issue and we'll get it resolved.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/tickets')}>
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="ticket-card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">

            {/* Title */}
            <div className="form-group full-width">
              <label className="form-label">Title <span className="req">*</span></label>
              <input
                className={`form-input${errors.title ? ' error' : ''}`}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                maxLength={120}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category <span className="req">*</span></label>
              <select
                className={`form-select${errors.category ? ' error' : ''}`}
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location <span className="req">*</span></label>
              <input
                className={`form-input${errors.resourceLocation ? ' error' : ''}`}
                name="resourceLocation"
                value={form.resourceLocation}
                onChange={handleChange}
                placeholder="e.g. LAB 1302, Block A"
              />
              {errors.resourceLocation && <span className="error-message">{errors.resourceLocation}</span>}
            </div>



            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">Description <span className="req">*</span></label>
              <textarea
                className={`form-textarea${errors.description ? ' error' : ''}`}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows={5}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            {/* Attachments */}
            <div className="form-group full-width">
              <label className="form-label">Attachments <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="form-input"
                style={{ padding: '0.6rem', cursor: 'pointer' }}
                onChange={e => setFiles(Array.from(e.target.files))}
              />
              {files.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  {files.length} file(s) selected
                </p>
              )}
            </div>

          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/tickets')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : '🚀 Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

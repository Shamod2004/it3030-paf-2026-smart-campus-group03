import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount
} from '../../endpoints/notificationApi'

// ─── Type icon/colour map ─────────────────────────────────────────────────────
const TYPE_META = {
  BOOKING_APPROVED:  { icon: '✅', color: '#10b981', label: 'Booking Approved' },
  BOOKING_REJECTED:  { icon: '❌', color: '#ef4444', label: 'Booking Rejected' },
  BOOKING_PENDING:   { icon: '⏳', color: '#f59e0b', label: 'Booking Pending' },
  BOOKING_CANCELLED: { icon: '🚫', color: '#6b7280', label: 'Booking Cancelled' },
  TICKET_ASSIGNED:   { icon: '🎫', color: '#6366f1', label: 'Ticket Assigned' },
  TICKET_UPDATED:    { icon: '🔄', color: '#0ea5e9', label: 'Ticket Updated' },
  TICKET_RESOLVED:   { icon: '🏁', color: '#10b981', label: 'Ticket Resolved' },
  SYSTEM:            { icon: '🔔', color: '#94a3b8', label: 'System' },
}

const getMeta = (type) => TYPE_META[type] || TYPE_META.SYSTEM

// ─── Time ago helper ──────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Unread', 'Bookings', 'Tickets']

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [activeFilter, setActiveFilter]   = useState('All')
  const [unreadCount, setUnreadCount]     = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [notifRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ])
      setNotifications(notifRes.data)
      setUnreadCount(countRes.data.unreadCount)
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = notifications.filter(n => {
    if (activeFilter === 'Unread')   return !n.isRead
    if (activeFilter === 'Bookings') return n.referenceType === 'BOOKING'
    if (activeFilter === 'Tickets')  return n.referenceType === 'TICKET'
    return true
  })

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
      setUnreadCount(c => Math.max(0, c - 1))
    } catch { toast.error('Failed to mark as read') }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch { toast.error('Failed to update notifications') }
  }

  const handleDelete = async (id, wasRead) => {
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      if (!wasRead) setUnreadCount(c => Math.max(0, c - 1))
    } catch { toast.error('Failed to delete notification') }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return
    try {
      await deleteAllNotifications()
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications cleared')
    } catch { toast.error('Failed to clear notifications') }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.topBar}>
        <div>
          <h1 style={s.title}>🔔 Notifications</h1>
          <p style={s.subtitle}>
            {unreadCount > 0
              ? <><span style={s.badge}>{unreadCount}</span> unread</>
              : 'All caught up 🎉'}
          </p>
        </div>
        <div style={s.actions}>
          {unreadCount > 0 && (
            <button style={s.btnSecondary} onClick={handleMarkAllRead}>
              ✓ Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button style={s.btnDanger} onClick={handleClearAll}>
              🗑 Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={s.tabs}>
        {FILTERS.map(f => (
          <button
            key={f}
            style={{ ...s.tab, ...(activeFilter === f ? s.tabActive : {}) }}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 &&
              <span style={s.tabBadge}>{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={s.center}>
          <div style={s.spinner} />
          <p style={{ color: '#94a3b8', marginTop: 16 }}>Loading notifications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 56 }}>🔕</span>
          <p style={{ color: '#94a3b8', marginTop: 12, fontSize: 15 }}>
            No {activeFilter !== 'All' ? activeFilter.toLowerCase() + ' ' : ''}notifications
          </p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map(n => (
            <NotificationRow
              key={n.id}
              notification={n}
              onMarkRead={() => handleMarkRead(n.id)}
              onDelete={() => handleDelete(n.id, n.isRead)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Single notification row ─────────────────────────────────────────────────
function NotificationRow({ notification: n, onMarkRead, onDelete }) {
  const meta = getMeta(n.type)

  return (
    <div style={{
      ...s.row,
      background: n.isRead ? 'var(--surface)' : 'rgba(99,102,241,0.08)',
      borderLeft: `4px solid ${n.isRead ? 'transparent' : meta.color}`,
    }}>
      {/* Icon */}
      <div style={{ ...s.iconWrap, background: `${meta.color}22`, color: meta.color }}>
        {meta.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={s.rowTop}>
          <span style={{ ...s.typeTag, background: `${meta.color}22`, color: meta.color }}>
            {meta.label}
          </span>
          <span style={s.time}>{timeAgo(n.createdAt)}</span>
        </div>
        <p style={{ ...s.message, fontWeight: n.isRead ? 400 : 600 }}>
          {n.message}
        </p>
        {n.referenceId && (
          <p style={s.ref}>
            {n.referenceType} #{n.referenceId}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={s.rowActions}>
        {!n.isRead && (
          <button style={s.btnRead} onClick={onMarkRead} title="Mark as read">
            ✓
          </button>
        )}
        <button style={s.btnDel} onClick={onDelete} title="Delete">
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page:       { maxWidth: 780, margin: '0 auto', padding: '0 4px' },
  topBar:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:      { fontSize: 26, fontWeight: 700 },
  subtitle:   { color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 },
  badge:      { background: '#6366f1', color: '#fff', borderRadius: 20, padding: '1px 9px', fontSize: 13, fontWeight: 700 },
  actions:    { display: 'flex', gap: 10 },
  btnSecondary:{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  btnDanger:  { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
  tabs:       { display: 'flex', gap: 6, marginBottom: 20 },
  tab:        { background: 'transparent', border: '1px solid var(--border)', color: '#94a3b8', padding: '7px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s' },
  tabActive:  { background: '#6366f1', borderColor: '#6366f1', color: '#fff' },
  tabBadge:   { background: '#ef4444', color: '#fff', borderRadius: 20, padding: '0 7px', fontSize: 11, fontWeight: 700 },
  list:       { display: 'flex', flexDirection: 'column', gap: 10 },
  row:        { display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px', borderRadius: 12, border: '1px solid var(--border)', transition: 'all .2s' },
  iconWrap:   { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  rowTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  typeTag:    { fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 },
  time:       { fontSize: 12, color: '#64748b' },
  message:    { fontSize: 14, color: '#e2e8f0', lineHeight: 1.5 },
  ref:        { fontSize: 12, color: '#64748b', marginTop: 4 },
  rowActions: { display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 },
  btnRead:    { background: 'rgba(16,185,129,0.15)', border: 'none', color: '#10b981', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  btnDel:     { background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  center:     { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' },
  spinner:    { width: 40, height: 40, borderRadius: '50%', border: '3px solid #334155', borderTop: '3px solid #6366f1', animation: 'spin .8s linear infinite' },
  empty:      { textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
}

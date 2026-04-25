import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getUnreadNotifications, markAsRead } from '../../services/notificationService'
import useAuth from '../../hooks/useAuth'
import { timeAgo } from '../../utils/helpers'

const TYPE_ICON = {
  BOOKING_APPROVED:  '✅',
  BOOKING_REJECTED:  '❌',
  BOOKING_PENDING:   '⏳',
  BOOKING_CANCELLED: '🚫',
  TICKET_ASSIGNED:   '🎫',
  TICKET_UPDATED:    '🔄',
  TICKET_RESOLVED:   '🏁',
  SYSTEM:            '🔔',
}

export default function Header() {
  const { user, logout } = useAuth()
  const [notifOpen, setNotifOpen]         = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!notifOpen) return
    getUnreadNotifications()
      .then(res => {
        setNotifications(res.data.slice(0, 6))
        setUnreadCount(res.data.length)
      })
      .catch(() => {})
  }, [notifOpen])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(c => Math.max(0, c - 1))
    } catch {/* ignore */}
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(c => Math.max(0, c - 1))
    } catch {/* ignore */}
  }

  return (
    <header style={s.header}>
      <div style={s.breadcrumb}>
        <span style={{ fontSize: 20 }}>🎓</span>
        <span style={s.breadcrumbText}>Smart Campus Operations Hub</span>
      </div>

      <div style={s.right}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button style={s.bellBtn} onClick={() => setNotifOpen(o => !o)} title="Notifications">
            🔔
            {unreadCount > 0 && (
              <span style={s.bellBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div style={s.dropdown}>
              <div style={s.dropdownHeader}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                <Link to="/notifications" style={s.seeAll} onClick={() => setNotifOpen(false)}>
                  See all →
                </Link>
              </div>

              {notifications.length === 0 ? (
                <div style={s.emptyDrop}>
                  <span style={{ fontSize: 28 }}>🎉</span>
                  <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>All caught up!</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={s.dropItem}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{TYPE_ICON[n.type] || '🔔'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{n.message}</p>
                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{timeAgo(n.createdAt)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button style={s.markReadBtn} onClick={() => handleMarkRead(n.id)}>Read</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <span style={s.roleBadge}>{user?.role || 'USER'}</span>
        <span style={s.userName}>{user?.name || 'User'}</span>
        <button onClick={logout} style={s.logoutBtn}>Logout</button>
      </div>
    </header>
  )
}

const s = {
  header:        { background: '#1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 100 },
  breadcrumb:    { display: 'flex', alignItems: 'center', gap: 8 },
  breadcrumbText:{ color: '#475569', fontSize: 14, fontWeight: 500 },
  right:         { display: 'flex', gap: 12, alignItems: 'center' },
  bellBtn:       { position: 'relative', background: '#273549', border: '1px solid #334155', color: '#f1f5f9', width: 38, height: 38, borderRadius: 10, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bellBadge:     { position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', borderRadius: 20, padding: '1px 5px', fontSize: 10, fontWeight: 700, minWidth: 18, textAlign: 'center' },
  dropdown:      { position: 'absolute', top: 46, right: 0, width: 340, background: '#1e293b', border: '1px solid #334155', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200 },
  dropdownHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #334155' },
  seeAll:        { fontSize: 12, color: '#818cf8', textDecoration: 'none' },
  dropItem:      { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 16px', borderBottom: '1px solid rgba(51,65,85,0.6)' },
  markReadBtn:   { background: 'rgba(16,185,129,0.15)', border: 'none', color: '#10b981', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600, flexShrink: 0 },
  deleteBtn:     { background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600, flexShrink: 0 },
  emptyDrop:     { padding: '30px 16px', textAlign: 'center' },
  roleBadge:     { fontSize: 11, fontWeight: 700, color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '3px 10px', borderRadius: 20 },
  userName:      { fontSize: 14, fontWeight: 500, color: '#e2e8f0' },
  logoutBtn:     { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer' },
}

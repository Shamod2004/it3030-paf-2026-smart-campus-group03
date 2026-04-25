import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, ChevronDown, User } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import { getUnreadCount, getUnreadNotifications, markAsRead } from '../services/notificationService'

const Navbar = () => {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount]     = useState(0)
  const [notifOpen, setNotifOpen]         = useState(false)
  const [notifications, setNotifications] = useState([])
  const [profileOpen, setProfileOpen]     = useState(false)
  const notifRef  = useRef(null)
  const profileRef = useRef(null)

  // Poll unread count every 30s
  useEffect(() => {
    const fetch = () =>
      getUnreadCount()
        .then(r => setUnreadCount(r.data?.unreadCount || r.data || 0))
        .catch(() => {})
    fetch()
    const t = setInterval(fetch, 30000)
    return () => clearInterval(t)
  }, [])

  // Load notifications when bell opens
  useEffect(() => {
    if (!notifOpen) return
    getUnreadNotifications()
      .then(r => { setNotifications(r.data?.slice(0, 5) || []); setUnreadCount(r.data?.length || 0) })
      .catch(() => {})
  }, [notifOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = e => {
      if (notifRef.current && !notifRef.current.contains(e.target))  setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(c => Math.max(0, c - 1))
    } catch {}
  }

  const dashPath = hasRole('ADMIN', 'MANAGER') ? '/dashboard' : '/user/dashboard'

  return (
    <nav style={s.nav}>
      {/* Logo */}
      <Link to={dashPath} style={s.logo}>
        <span style={{ fontSize: 22 }}>🎓</span>
        <span style={s.logoText}>Smart Campus</span>
      </Link>

      <div style={s.right}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button style={s.iconBtn} onClick={() => setNotifOpen(o => !o)}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={s.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div style={s.dropdown}>
              <div style={s.dropHead}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                <Link to="/notifications" style={s.seeAll} onClick={() => setNotifOpen(false)}>
                  See all →
                </Link>
              </div>
              {notifications.length === 0 ? (
                <div style={s.empty}>
                  <span style={{ fontSize: 28 }}>🎉</span>
                  <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>All caught up!</p>
                </div>
              ) : notifications.map(n => (
                <div key={n.id} style={s.notifItem}>
                  <span style={{ fontSize: 18 }}>
                    {n.type?.includes('APPROVED') ? '✅' : n.type?.includes('REJECTED') ? '❌' : n.type?.includes('RESOURCE') ? '🏢' : '🔔'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{n.message}</p>
                  </div>
                  <button style={s.readBtn} onClick={() => handleMarkRead(n.id)}>✓</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role chip */}
        <span style={s.roleChip}>{user?.role || 'USER'}</span>

        {/* Profile dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button style={s.profileBtn} onClick={() => setProfileOpen(o => !o)}>
            <div style={s.avatar}>{(user?.name || 'U').charAt(0).toUpperCase()}</div>
            <span style={s.userName}>{user?.name?.split(' ')[0] || 'User'}</span>
            <ChevronDown size={14} />
          </button>

          {profileOpen && (
            <div style={s.profileDrop}>
              <div style={s.profileInfo}>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>{user?.name}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>{user?.email}</p>
              </div>
              <div style={s.divider} />
              <button style={s.dropItem} onClick={() => { navigate('/notifications'); setProfileOpen(false) }}>
                <Bell size={14} /> Notifications
              </button>
              <div style={s.divider} />
              <button style={{ ...s.dropItem, color: '#ef4444' }} onClick={logout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav:        { background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200 },
  logo:       { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoText:   { fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  right:      { display: 'flex', alignItems: 'center', gap: 12 },
  iconBtn:    { position: 'relative', background: '#273549', border: '1px solid #334155', color: '#f1f5f9', width: 38, height: 38, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge:      { position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', borderRadius: 20, padding: '1px 5px', fontSize: 10, fontWeight: 700, minWidth: 18, textAlign: 'center' },
  dropdown:   { position: 'absolute', top: 46, right: 0, width: 320, background: '#1e293b', border: '1px solid #334155', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 300 },
  dropHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #334155' },
  seeAll:     { fontSize: 12, color: '#818cf8', textDecoration: 'none' },
  notifItem:  { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 16px', borderBottom: '1px solid rgba(51,65,85,0.5)' },
  readBtn:    { background: 'rgba(16,185,129,0.15)', border: 'none', color: '#10b981', padding: '3px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, flexShrink: 0 },
  empty:      { padding: '28px 16px', textAlign: 'center' },
  roleChip:   { fontSize: 11, fontWeight: 700, color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '3px 10px', borderRadius: 20 },
  profileBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #334155', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: '#e2e8f0' },
  avatar:     { width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' },
  userName:   { fontSize: 14, fontWeight: 500 },
  profileDrop:{ position: 'absolute', top: 46, right: 0, width: 220, background: '#1e293b', border: '1px solid #334155', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 300, overflow: 'hidden' },
  profileInfo:{ padding: '14px 16px' },
  divider:    { height: 1, background: '#334155' },
  dropItem:   { width: '100%', background: 'none', border: 'none', color: '#94a3b8', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, textAlign: 'left' },
}

export default Navbar

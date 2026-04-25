import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Box, Calendar, Bell, Users, Settings, LogOut, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import { getUnreadCount } from '../services/notificationService'

// ── Nav definitions ────────────────────────────────────────────────────────────

const USER_NAV = [
  { to: '/user/dashboard',      label: 'Dashboard',      icon: Home },
  { to: '/user/resources',      label: 'Resources',      icon: Box },
  { to: '/bookings/create',     label: 'Create Booking', icon: Calendar },
  { to: '/bookings/my',         label: 'My Bookings',    icon: ClipboardList },
  { to: '/notifications',       label: 'Notifications',  icon: Bell, badge: true },
]

const ADMIN_NAV = [
  { to: '/dashboard',           label: 'Dashboard',       icon: Home },
  { to: '/admin/resources',     label: 'Manage Resources',icon: Box },
  { to: '/admin/bookings',      label: 'Booking Requests',icon: ClipboardList },
  { to: '/admin/all-bookings',  label: 'All Bookings',    icon: Calendar },
  { to: '/notifications',       label: 'Notifications',   icon: Bell, badge: true },
  { to: '/admin/users',         label: 'Users',           icon: Users },
]

// ── Component ──────────────────────────────────────────────────────────────────

const Sidebar = () => {
  const { user, hasRole, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed]   = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const isAdmin = hasRole('ADMIN', 'MANAGER')
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV

  useEffect(() => {
    const fetch = () =>
      getUnreadCount()
        .then(r => setUnreadCount(r.data?.unreadCount || r.data || 0))
        .catch(() => {})
    fetch()
    const t = setInterval(fetch, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside style={{ ...s.sidebar, width: collapsed ? 64 : 230 }}>
      {/* Header */}
      <div style={s.header}>
        {!collapsed && (
          <div style={s.brand}>
            <span style={{ fontSize: 20 }}>🎓</span>
            <span style={s.brandText}>Smart Campus</span>
          </div>
        )}
        <button style={s.collapseBtn} onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role label */}
      {!collapsed && (
        <div style={s.roleLabel}>
          <span style={s.roleDot} />
          {isAdmin ? 'Admin Panel' : 'Student Portal'}
        </div>
      )}

      {/* Nav */}
      <nav style={s.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard' || item.to === '/user/dashboard'}
            style={({ isActive }) => ({ ...s.navItem, ...(isActive ? s.navActive : {}) })}
          >
            <span style={s.navIcon}><item.icon size={18} /></span>
            {!collapsed && <span style={s.navLabel}>{item.label}</span>}
            {!collapsed && item.badge && unreadCount > 0 && (
              <span style={s.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
            {collapsed && item.badge && unreadCount > 0 && (
              <span style={s.badgeDot} />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.userRow}>
          <div style={s.avatar}>{(user?.name || 'U').charAt(0).toUpperCase()}</div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={s.userName}>{user?.name || 'User'}</p>
              <p style={s.userRole}>{user?.role || 'USER'}</p>
            </div>
          )}
          {!collapsed && (
            <button style={s.logoutBtn} onClick={logout} title="Logout">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

const s = {
  sidebar:    { background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'width .25s ease', flexShrink: 0 },
  header:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 12px', borderBottom: '1px solid #334155' },
  brand:      { display: 'flex', alignItems: 'center', gap: 8 },
  brandText:  { fontWeight: 800, fontSize: 15, color: '#f1f5f9', whiteSpace: 'nowrap' },
  collapseBtn:{ background: '#273549', border: '1px solid #334155', color: '#64748b', width: 26, height: 26, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  roleLabel:  { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase' },
  roleDot:    { width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 },
  nav:        { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 8px' },
  navItem:    { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, textDecoration: 'none', color: '#94a3b8', fontSize: 14, fontWeight: 500, position: 'relative', transition: 'all .15s' },
  navActive:  { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontWeight: 600, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
  navIcon:    { flexShrink: 0, width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navLabel:   { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' },
  badge:      { background: '#ef4444', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  badgeDot:   { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' },
  footer:     { borderTop: '1px solid #334155', padding: '12px 8px' },
  userRow:    { display: 'flex', alignItems: 'center', gap: 8 },
  avatar:     { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 },
  userName:   { fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole:   { fontSize: 11, color: '#818cf8' },
  logoutBtn:  { background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
}

export default Sidebar

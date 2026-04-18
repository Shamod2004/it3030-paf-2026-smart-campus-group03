import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getUnreadCount } from '../../services/notificationService'
import useAuth from '../../hooks/useAuth'

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',     icon: '🏠' },
  { to: '/facilities',    label: 'Facilities',    icon: '🏢' },
  { to: '/bookings',      label: 'Bookings',      icon: '📅' },
  { to: '/tickets',       label: 'Tickets',       icon: '🎫' },
  { to: '/notifications', label: 'Notifications', icon: '🔔', showBadge: true },
]

const ADMIN_NAV = [
  { to: '/admin',       label: 'Overview',        icon: '📊' },
  { to: '/admin/users', label: 'User Management', icon: '👥' },
]

export default function Sidebar() {
  const { user, hasRole, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [collapsed, setCollapsed]     = useState(false)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getUnreadCount()
        setUnreadCount(res.data.unreadCount || 0)
      } catch {/* ignore */}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside style={{ ...s.sidebar, width: collapsed ? 68 : 240 }}>
      {/* Logo */}
      <div style={s.logo}>
        <span style={s.logoIcon}>🎓</span>
        {!collapsed && <span style={s.logoText}>Smart Campus</span>}
        <button style={s.collapseBtn} onClick={() => setCollapsed(c => !c)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main nav */}
      <nav style={s.nav}>
        {!collapsed && <p style={s.navLabel}>MAIN MENU</p>}
        {NAV.map(link => (
          <NavLink key={link.to} to={link.to} style={navStyle} end={link.to === '/dashboard'}>
            <span style={s.navIcon}>{link.icon}</span>
            {!collapsed && <span style={s.navText}>{link.label}</span>}
            {!collapsed && link.showBadge && unreadCount > 0 && (
              <span style={s.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
            {collapsed && link.showBadge && unreadCount > 0 && (
              <span style={s.badgeCollapsed}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </NavLink>
        ))}

        {/* Admin section */}
        {hasRole('ADMIN') && (
          <>
            {!collapsed && <p style={{ ...s.navLabel, marginTop: 20 }}>ADMIN</p>}
            {collapsed && <div style={s.divider} />}
            {ADMIN_NAV.map(link => (
              <NavLink key={link.to} to={link.to} style={navStyle}>
                <span style={s.navIcon}>{link.icon}</span>
                {!collapsed && <span style={s.navText}>{link.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User info at bottom */}
      <div style={s.userSection}>
        <div style={s.userAvatar}>
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={s.userName}>{user?.name || 'User'}</p>
            <p style={s.userRole}>{user?.role || 'USER'}</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={logout} style={s.logoutBtn} title="Logout">⏻</button>
        )}
      </div>
    </aside>
  )
}

const navStyle = ({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 10,
  textDecoration: 'none',
  color: isActive ? '#fff' : '#94a3b8',
  background: isActive ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
  fontWeight: isActive ? 600 : 400,
  fontSize: 14,
  position: 'relative',
  transition: 'all .2s',
  boxShadow: isActive ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
})

const s = {
  sidebar:      { background: '#1e293b', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4, borderRight: '1px solid #334155', transition: 'width .25s ease', flexShrink: 0, minHeight: '100vh' },
  logo:         { display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px', marginBottom: 24 },
  logoIcon:     { fontSize: 24, flexShrink: 0 },
  logoText:     { fontWeight: 700, fontSize: 16, color: '#f1f5f9', flex: 1 },
  collapseBtn:  { background: 'none', border: '1px solid #334155', color: '#64748b', width: 24, height: 24, borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nav:          { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  navLabel:     { fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.08em', padding: '4px 12px', marginBottom: 4 },
  navIcon:      { fontSize: 18, flexShrink: 0, width: 22, textAlign: 'center' },
  navText:      { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' },
  badge:        { background: '#ef4444', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  badgeCollapsed: { position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  divider:      { borderTop: '1px solid #334155', margin: '12px 0' },
  userSection:  { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px', borderTop: '1px solid #334155', marginTop: 8 },
  userAvatar:   { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0 },
  userName:     { fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole:     { fontSize: 11, color: '#818cf8', marginTop: 1 },
  logoutBtn:    { background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
}

import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const STAT_CARDS = [
  { icon: '🏢', label: 'Facilities',    to: '/facilities',    color: '#6366f1', desc: 'Browse campus facilities' },
  { icon: '📅', label: 'Bookings',      to: '/bookings',      color: '#0ea5e9', desc: 'Manage your bookings' },
  { icon: '🎫', label: 'Tickets',       to: '/tickets',       color: '#f59e0b', desc: 'Submit maintenance requests' },
  { icon: '🔔', label: 'Notifications', to: '/notifications', color: '#10b981', desc: 'View all notifications' },
]

const ROLE_DESC = {
  USER:       'Browse facilities, make bookings, and submit maintenance tickets.',
  TECHNICIAN: 'Handle assigned maintenance tickets and update resolution status.',
  MANAGER:    'Approve or reject booking requests for campus facilities.',
  ADMIN:      'Full access: manage users, facilities, bookings, and tickets.',
}

function getTime() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="animate-fadeIn">
      {/* Welcome Banner */}
      <div style={s.welcome}>
        <div>
          <h1 style={s.welcomeTitle}>
            Good {getTime()}, <span style={{ color: '#818cf8' }}>{user?.name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p style={s.welcomeDesc}>{ROLE_DESC[user?.role] || 'Welcome to Smart Campus Hub.'}</p>
        </div>
        <div style={s.roleChip}>
          <span style={s.roleDot} />
          {user?.role || 'USER'}
        </div>
      </div>

      {/* Navigation Cards */}
      <div style={s.grid}>
        {STAT_CARDS.map(c => (
          <Link key={c.to} to={c.to} className="card-hover" style={{ ...s.card, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ ...s.cardIcon, background: `${c.color}20`, color: c.color }}>{c.icon}</div>
            <p style={s.cardLabel}>{c.label}</p>
            <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{c.desc}</p>
            <span style={{ ...s.cardArrow, color: c.color }}>→</span>
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div style={s.infoBanner}>
        <span style={{ fontSize: 32 }}>📋</span>
        <div>
          <p style={s.infoTitle}>Smart Campus Operations Hub</p>
          <p style={s.infoDesc}>
            Manage facility bookings, maintenance tickets, and campus resources from one central platform.
            Use the sidebar to navigate between modules. Your role determines what actions you can perform.
          </p>
        </div>
      </div>
    </div>
  )
}

const s = {
  welcome:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  welcomeTitle: { fontSize: 28, fontWeight: 800, marginBottom: 8 },
  welcomeDesc:  { color: '#94a3b8', fontSize: 14, maxWidth: 500, lineHeight: 1.7 },
  roleChip:     { display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, flexShrink: 0 },
  roleDot:      { width: 8, height: 8, borderRadius: '50%', background: '#10b981' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 16, marginBottom: 28 },
  card:         { background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 8, transition: 'all .25s', cursor: 'pointer' },
  cardIcon:     { width: 50, height: 50, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 4 },
  cardLabel:    { fontSize: 16, fontWeight: 700, color: '#e2e8f0' },
  cardArrow:    { fontSize: 20, fontWeight: 700, marginTop: 4 },
  infoBanner:   { background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(14,165,233,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '22px 26px', display: 'flex', gap: 20, alignItems: 'flex-start' },
  infoTitle:    { fontWeight: 700, fontSize: 15, color: '#e2e8f0', marginBottom: 8 },
  infoDesc:     { color: '#64748b', fontSize: 13, lineHeight: 1.7 },
}

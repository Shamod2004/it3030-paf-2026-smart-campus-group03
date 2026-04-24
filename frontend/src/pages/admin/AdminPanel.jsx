import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const ROLE_META = {
  USER:       { color: '#818cf8', bg: 'rgba(99,102,241,0.12)',   label: 'USER'       },
  TECHNICIAN: { color: '#38bdf8', bg: 'rgba(14,165,233,0.12)',   label: 'TECHNICIAN' },
  MANAGER:    { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',   label: 'MANAGER'    },
  ADMIN:      { color: '#f87171', bg: 'rgba(239,68,68,0.12)',    label: 'ADMIN'      },
}

export default function AdminPanel() {
  const { user } = useAuth()

  const cards = [
    { icon: '👥', title: 'User Management',    desc: 'View and manage user accounts, assign roles, enable/disable users', to: '/admin/users',   color: '#6366f1' },
    { icon: '🏢', title: 'Facilities',          desc: 'Add, edit, and manage campus facilities and their availability',    to: '/facilities',    color: '#0ea5e9' },
    { icon: '📅', title: 'All Bookings',         desc: 'View and approve/reject all pending facility booking requests',     to: '/bookings',      color: '#f59e0b' },
    { icon: '🎫', title: 'Tickets',              desc: 'Manage all maintenance and incident tickets across campus',         to: '/tickets',       color: '#10b981' },
    { icon: '🔔', title: 'Notifications',        desc: 'View and manage system notifications sent to users',               to: '/notifications', color: '#8b5cf6' },
  ]

  const roleMeta = ROLE_META[user?.role] || ROLE_META.USER

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.hero}>
        <div>
          <h1 style={s.title}>⚙️ Admin Panel</h1>
          <p style={s.subtitle}>Smart Campus Operations Hub — Administration Console</p>
        </div>
        <div style={{ ...s.rolePill, background: roleMeta.bg, color: roleMeta.color }}>
          {roleMeta.label}
        </div>
      </div>

      {/* Welcome banner */}
      <div style={s.banner}>
        <div style={s.bannerLeft}>
          <p style={s.bannerGreeting}>Welcome back, <strong>{user?.name}</strong> 👋</p>
          <p style={s.bannerText}>
            You have full administrative access to manage users, facilities, bookings, and system settings.
          </p>
        </div>
        <span style={s.bannerIcon}>🛡️</span>
      </div>

      {/* Quick access cards */}
      <h2 style={s.sectionTitle}>Quick Access</h2>
      <div style={s.grid}>
        {cards.map(card => (
          <Link key={card.to} to={card.to} style={{ ...s.card, '--card-color': card.color }}>
            <div style={{ ...s.cardIcon, background: `${card.color}22`, color: card.color }}>
              {card.icon}
            </div>
            <h3 style={s.cardTitle}>{card.title}</h3>
            <p style={s.cardDesc}>{card.desc}</p>
            <span style={{ ...s.cardArrow, color: card.color }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

const s = {
  page:         { padding: '0 2px' },
  hero:         { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:        { fontSize: 28, fontWeight: 800 },
  subtitle:     { color: '#64748b', fontSize: 14, marginTop: 4 },
  rolePill:     { fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, letterSpacing: '0.05em' },
  banner:       { background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(14,165,233,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '22px 28px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  bannerLeft:   {},
  bannerGreeting:{ fontSize: 16, color: '#e2e8f0', marginBottom: 6 },
  bannerText:   { fontSize: 13, color: '#94a3b8', maxWidth: 480, lineHeight: 1.6 },
  bannerIcon:   { fontSize: 48, opacity: 0.6 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  card:         { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 20px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8, transition: 'transform .2s, box-shadow .2s, border-color .2s', cursor: 'pointer' },
  cardIcon:     { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 4 },
  cardTitle:    { fontSize: 15, fontWeight: 700, color: '#e2e8f0' },
  cardDesc:     { fontSize: 13, color: '#64748b', lineHeight: 1.5, flex: 1 },
  cardArrow:    { fontSize: 18, fontWeight: 700, marginTop: 4 },
}

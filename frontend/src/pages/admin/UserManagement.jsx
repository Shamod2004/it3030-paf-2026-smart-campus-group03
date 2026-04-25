import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
} from '../../api/adminApi'

const ROLES = ['USER', 'TECHNICIAN', 'MANAGER', 'ADMIN']

const ROLE_COLOR = {
  USER:       { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },
  TECHNICIAN: { bg: 'rgba(14,165,233,0.15)', text: '#38bdf8' },
  MANAGER:    { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
  ADMIN:      { bg: 'rgba(239,68,68,0.15)',  text: '#f87171' },
}

export default function UserManagement() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [searchQuery, setSearch]    = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [editingId, setEditingId]   = useState(null)
  const [newRole, setNewRole]       = useState('')

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllUsers()
      setUsers(res.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // ── Filter ──────────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase())
      || u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  // ── Role update ─────────────────────────────────────────────────────────
  const handleRoleUpdate = async (userId) => {
    try {
      const res = await updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? res.data : u))
      toast.success('Role updated successfully')
      setEditingId(null)
    } catch {
      toast.error('Failed to update role')
    }
  }

  // ── Toggle enable/disable ───────────────────────────────────────────────
  const handleToggleStatus = async (userId, currentEnabled) => {
    const action = currentEnabled ? 'disable' : 'enable'
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return
    try {
      const res = await toggleUserStatus(userId, !currentEnabled)
      setUsers(prev => prev.map(u => u.id === userId ? res.data : u))
      toast.success(`User account ${action}d`)
    } catch {
      toast.error('Failed to update user status')
    }
  }

  // ── Stats bar ────────────────────────────────────────────────────────────
  const stats = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length
    return acc
  }, {})

  return (
    <div style={s.page}>

      {/* ── Page header ── */}
      <div style={s.topBar}>
        <div>
          <h1 style={s.title}>👥 User Management</h1>
          <p style={s.subtitle}>{users.length} total users</p>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div style={s.statsRow}>
        {ROLES.map(role => (
          <div key={role} style={{ ...s.statCard, borderTop: `3px solid ${ROLE_COLOR[role].text}` }}>
            <span style={{ ...s.roleTag, background: ROLE_COLOR[role].bg, color: ROLE_COLOR[role].text }}>
              {role}
            </span>
            <p style={s.statNum}>{stats[role] || 0}</p>
            <p style={s.statLabel}>users</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={s.filterBar}>
        <input
          style={s.searchInput}
          placeholder="🔍  Search by name or email..."
          value={searchQuery}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={s.roleFilterWrap}>
          {['ALL', ...ROLES].map(r => (
            <button
              key={r}
              style={{ ...s.filterBtn, ...(roleFilter === r ? s.filterBtnActive : {}) }}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div style={s.center}><div style={s.spinner} /></div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 48 }}>👤</span>
          <p style={{ color: '#94a3b8', marginTop: 12 }}>No users found</p>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>User</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Provider</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} style={s.tr}>
                  {/* Name */}
                  <td style={s.td}>
                    <div style={s.avatarRow}>
                      <div style={{ ...s.avatar, background: ROLE_COLOR[user.role]?.bg || '#1e293b' }}>
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                        {user.id === currentUser.id &&
                          <span style={s.youTag}>you</span>}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ ...s.td, color: '#94a3b8', fontSize: 13 }}>{user.email}</td>

                  {/* Role */}
                  <td style={s.td}>
                    {editingId === user.id ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          style={{ ...s.roleSelect }}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button style={s.btnSave} onClick={() => handleRoleUpdate(user.id)}>Save</button>
                        <button style={s.btnCancel} onClick={() => setEditingId(null)}>✕</button>
                      </div>
                    ) : (
                      <span style={{
                        ...s.roleTag,
                        background: ROLE_COLOR[user.role]?.bg,
                        color: ROLE_COLOR[user.role]?.text
                      }}>
                        {user.role}
                      </span>
                    )}
                  </td>

                  {/* Provider */}
                  <td style={s.td}>
                    <span style={s.providerTag}>
                      {user.provider === 'GOOGLE' ? '🔵 Google' : '🔑 Local'}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={s.td}>
                    <span style={{
                      ...s.statusDot,
                      background: user.enabled
                        ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                      color: user.enabled ? '#10b981' : '#ef4444'
                    }}>
                      {user.enabled ? '● Active' : '● Disabled'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {user.id !== currentUser.id && (
                        <>
                          <button
                            style={s.btnEdit}
                            onClick={() => { setEditingId(user.id); setNewRole(user.role) }}
                            title="Change role"
                          >
                            ✏️ Role
                          </button>
                          <button
                            style={user.enabled ? s.btnDisable : s.btnEnable}
                            onClick={() => handleToggleStatus(user.id, user.enabled)}
                          >
                            {user.enabled ? '🔒 Disable' : '🔓 Enable'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page:          { padding: '0 2px' },
  topBar:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title:         { fontSize: 26, fontWeight: 700 },
  subtitle:      { color: '#94a3b8', marginTop: 4, fontSize: 14 },
  statsRow:      { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 },
  statCard:      { background: 'var(--surface)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--border)' },
  statNum:       { fontSize: 28, fontWeight: 700, marginTop: 8 },
  statLabel:     { fontSize: 12, color: '#94a3b8' },
  filterBar:     { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  searchInput:   { flex: 1, minWidth: 220, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', color: 'var(--text)', fontSize: 14 },
  roleFilterWrap:{ display: 'flex', gap: 6, flexWrap: 'wrap' },
  filterBtn:     { background: 'transparent', border: '1px solid var(--border)', color: '#94a3b8', padding: '7px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all .2s' },
  filterBtnActive:{ background: '#6366f1', borderColor: '#6366f1', color: '#fff' },
  tableWrap:     { background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' },
  table:         { width: '100%', borderCollapse: 'collapse' },
  thead:         { background: 'var(--surface-2)' },
  th:            { padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr:            { borderBottom: '1px solid var(--border)', transition: 'background .2s' },
  td:            { padding: '14px 18px', verticalAlign: 'middle' },
  avatarRow:     { display: 'flex', alignItems: 'center', gap: 10 },
  avatar:        { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' },
  youTag:        { fontSize: 10, background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '1px 6px', borderRadius: 20 },
  roleTag:       { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  providerTag:   { fontSize: 12, color: '#94a3b8' },
  statusDot:     { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  roleSelect:    { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '5px 8px', fontSize: 13 },
  btnSave:       { background: '#6366f1', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer' },
  btnCancel:     { background: 'transparent', border: '1px solid var(--border)', color: '#94a3b8', padding: '5px 8px', borderRadius: 7, fontSize: 12, cursor: 'pointer' },
  btnEdit:       { background: 'rgba(99,102,241,0.12)', border: 'none', color: '#818cf8', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' },
  btnDisable:    { background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' },
  btnEnable:     { background: 'rgba(16,185,129,0.1)', border: 'none', color: '#10b981', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' },
  center:        { display: 'flex', justifyContent: 'center', padding: '60px 0' },
  spinner:       { width: 40, height: 40, borderRadius: '50%', border: '3px solid #334155', borderTop: '3px solid #6366f1', animation: 'spin .8s linear infinite' },
  empty:         { textAlign: 'center', padding: '60px 0' },
}

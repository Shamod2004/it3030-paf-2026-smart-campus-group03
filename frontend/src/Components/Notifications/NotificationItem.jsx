import React from 'react'
import { timeAgo } from '../../utils/helpers'

const TYPE_ICON = {
  BOOKING_APPROVED: '✅', BOOKING_REJECTED: '❌', BOOKING_PENDING: '⏳',
  BOOKING_CANCELLED: '🚫', TICKET_ASSIGNED: '🎫', TICKET_UPDATED: '🔄',
  TICKET_RESOLVED: '🏁', SYSTEM: '🔔',
}

const NotificationItem = ({ notification, onMarkRead, onDelete }) => (
  <div style={{
    padding: '14px 18px', borderRadius: 10,
    background: notification.isRead ? 'transparent' : 'rgba(99,102,241,0.08)',
    border: `1px solid ${notification.isRead ? '#334155' : 'rgba(99,102,241,0.25)'}`,
    display: 'flex', gap: 12, alignItems: 'flex-start',
    transition: 'all .2s'
  }}>
    <span style={{ fontSize: 20, flexShrink: 0 }}>{TYPE_ICON[notification.type] || '🔔'}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 14, color: '#e2e8f0', marginBottom: 4 }}>{notification.message}</p>
      <p style={{ fontSize: 12, color: '#64748b' }}>{timeAgo(notification.createdAt)}</p>
    </div>
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      {!notification.isRead && (
        <button onClick={() => onMarkRead(notification.id)} style={{
          background: 'rgba(16,185,129,0.1)', border: 'none',
          color: '#10b981', padding: '4px 10px', borderRadius: 6,
          fontSize: 12, cursor: 'pointer', fontWeight: 600
        }}>Mark read</button>
      )}
      <button onClick={() => onDelete(notification.id)} style={{
        background: 'rgba(239,68,68,0.1)', border: 'none',
        color: '#ef4444', width: 26, height: 26, borderRadius: 6,
        fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>✕</button>
    </div>
  </div>
)

export default NotificationItem

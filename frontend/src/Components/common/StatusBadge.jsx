import React from 'react'

const STATUS_CONFIG = {
  PENDING:        { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  APPROVED:       { color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  REJECTED:       { color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  CANCELLED:      { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  OPEN:           { color: '#6366f1', bg: 'rgba(99,102,241,0.12)'  },
  IN_PROGRESS:    { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)'  },
  RESOLVED:       { color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  CLOSED:         { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  ACTIVE:         { color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  OUT_OF_SERVICE: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
}

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' }
  return (
    <span style={{
      background: config.bg,
      color: config.color,
      padding: '3px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      border: `1px solid ${config.color}40`,
      whiteSpace: 'nowrap',
    }}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

export default StatusBadge

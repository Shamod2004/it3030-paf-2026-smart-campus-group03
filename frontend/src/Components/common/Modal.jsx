import React from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const widths = { sm: 400, md: 520, lg: 700 }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: '#1e293b', borderRadius: 16, padding: 28,
        width: '100%', maxWidth: widths[size] || widths.md,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        border: '1px solid #334155',
        animation: 'fadeIn .2s ease'
      }} onClick={e => e.stopPropagation()}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
            <button onClick={onClose} style={{
              background: 'rgba(239,68,68,0.1)', border: 'none',
              color: '#ef4444', width: 30, height: 30,
              borderRadius: 8, cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal

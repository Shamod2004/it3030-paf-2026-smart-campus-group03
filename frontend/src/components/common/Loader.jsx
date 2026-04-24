import React from 'react'

const Loader = ({ text = '' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 16 }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid #334155',
      borderTop: '3px solid #6366f1',
      animation: 'spin 0.8s linear infinite'
    }} />
    {text && <p style={{ color: '#64748b', fontSize: 13 }}>{text}</p>}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default Loader

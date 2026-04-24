import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const name  = searchParams.get('name')
    const role  = searchParams.get('role')
    const email = searchParams.get('email')
    const id    = searchParams.get('id')

    if (!token) {
      setError('OAuth2 login failed. No token received.')
      setTimeout(() => navigate('/login'), 3000)
      return
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ id, name, email, role }))
    toast.success(`Welcome, ${name}! Signed in with Google. 🎉`)
    navigate('/user/dashboard', { replace: true })
  }, [])

  if (error) return (
    <div style={s.container}>
      <div style={s.card}>
        <span style={{ fontSize: 48 }}>❌</span>
        <h2 style={{ color: '#ef4444', marginTop: 16 }}>Login Failed</h2>
        <p style={{ color: '#94a3b8', marginTop: 8 }}>{error}</p>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Redirecting to login...</p>
      </div>
    </div>
  )

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.spinner} />
        <h2 style={{ marginTop: 24, fontSize: 18 }}>Signing you in...</h2>
        <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>Completing Google authentication</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const s = {
  container: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card:      { background: '#1e293b', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px solid #334155', color: '#f1f5f9' },
  spinner:   { width: 48, height: 48, borderRadius: '50%', border: '4px solid #334155', borderTop: '4px solid #6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto' }
}

export default OAuthCallback

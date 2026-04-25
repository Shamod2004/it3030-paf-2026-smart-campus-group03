import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '../../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Fill in all fields'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColor = ['transparent', '#ef4444', '#f59e0b', '#10b981'][strength]
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength]

  return (
    <div style={s.bg}>
      <div style={s.blob1} /><div style={s.blob2} />
      <div style={s.card}>
        <div style={s.logo}>
          <span style={{ fontSize: 28 }}>🎓</span>
          <h1 style={s.logoText}>Smart Campus Hub</h1>
        </div>
        <p style={s.subtitle}>Create your account to get started</p>

        <button style={s.googleBtn} onClick={handleGoogleLogin} type="button">
          <GoogleIcon /> Sign up with Google
        </button>

        <div style={s.divider}>
          <div style={s.line} />
          <span style={s.dividerText}>or create account with email</span>
          <div style={s.line} />
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters" value={form.password} onChange={handleChange}
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(p => !p)} style={s.eyeBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#334155', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(strength / 3) * 100}%`, background: strengthColor, transition: 'all .3s', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: strengthColor, fontWeight: 700 }}>{strengthLabel}</span>
              </div>
            )}
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input name="confirm" type="password" placeholder="Repeat password" value={form.confirm}
              onChange={handleChange}
              style={{ borderColor: form.confirm && form.password !== form.confirm ? '#ef4444' : '' }} />
          </div>
          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? <span style={s.spinner} /> : '✓ Create Account'}
          </button>
        </form>

        <p style={s.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input { background:#0f172a; border:1px solid #334155; border-radius:10px; padding:11px 14px; color:#f1f5f9; font-size:14px; outline:none; width:100%; font-family:inherit; }
        input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
        input::placeholder { color:#475569; }
      `}</style>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.5 5.8l6.2 5.2C40.2 36.2 44 30.6 44 24c0-1.3-.1-2.7-.4-3.9z"/>
  </svg>
)

const s = {
  bg:         { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: 20 },
  blob1:      { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', top: -100, right: -100, pointerEvents: 'none' },
  blob2:      { position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', bottom: -60, left: -60, pointerEvents: 'none' },
  card:       { background: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1, animation: 'fadeIn .4s ease' },
  logo:       { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 },
  logoText:   { fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle:   { color: '#64748b', fontSize: 14, marginBottom: 24 },
  googleBtn:  { width: '100%', background: '#fff', border: 'none', color: '#1a1a1a', borderRadius: 10, padding: '11px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18, fontFamily: 'inherit' },
  divider:    { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 },
  line:       { flex: 1, height: 1, background: '#334155' },
  dividerText:{ color: '#475569', fontSize: 12, whiteSpace: 'nowrap' },
  form:       { display: 'flex', flexDirection: 'column', gap: 14 },
  field:      { display: 'flex', flexDirection: 'column', gap: 6 },
  label:      { fontSize: 13, fontWeight: 500, color: '#94a3b8' },
  eyeBtn:     { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 },
  submitBtn:  { background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', fontFamily: 'inherit' },
  spinner:    { width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin .7s linear infinite' },
  loginText:  { textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 18 },
  link:       { color: '#818cf8', fontWeight: 600 },
}

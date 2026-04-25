import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar  from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        .card-hover:hover  { transform: translateY(-3px) !important; box-shadow: 0 12px 30px rgba(0,0,0,0.3) !important; border-color: #4f46e5 !important; }
        .animate-fadeIn    { animation: fadeIn .3s ease; }
      `}</style>

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', animation: 'fadeIn .3s ease' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/common/Sidebar'
import Header  from '../Components/common/Header'

export default function DashboardLayout() {
  return (
    <>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        .card-hover { transition: all .25s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); border-color: #4f46e5 !important; }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Header />
          <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', animation: 'fadeIn .3s ease' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

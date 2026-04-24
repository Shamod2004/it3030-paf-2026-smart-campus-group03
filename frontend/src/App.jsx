import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import PublicLayout    from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Auth Pages
import Login         from './pages/auth/Login'
import Register      from './pages/auth/Register'
import OAuthCallback from './pages/auth/OAuthCallback'

// Dashboard
import Dashboard     from './pages/dashboard/Dashboard'
import UserDashboard from './pages/UserDashboard'

// Resources (Module A)
import ResourcesManagement from './pages/ResourcesManagement'
import UserResourcesPage   from './pages/UserResourcesPage'

// Notifications & Admin
import Notifications  from './pages/notifications/Notifications'
import AdminPanel     from './pages/admin/AdminPanel'
import UserManagement from './pages/admin/UserManagement'

// Tickets (Module C)
import TicketPage    from './pages/tickets/TicketPage'
import TicketCreate  from './pages/tickets/TicketCreate'
import TicketDetails from './pages/tickets/TicketDetails'

// Guards
import PrivateRoute from './routes/PrivateRoute'
import RoleRoute    from './routes/RoleRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* ── Public Routes ─────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"                element={<Navigate to="/login" replace />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
        </Route>

        {/* ── UserDashboard — has its own UserLayout (Navbar + UserSidebar) ── */}
        <Route path="/user/dashboard" element={
          <PrivateRoute><UserDashboard /></PrivateRoute>
        } />
        <Route path="/user/resources" element={
          <PrivateRoute><UserResourcesPage /></PrivateRoute>
        } />

        {/* ── Protected Routes inside DashboardLayout ───────────────── */}
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Resources admin (Module A) */}
          <Route path="/admin/resources" element={
            <RoleRoute roles={['ADMIN', 'MANAGER']}>
              <ResourcesManagement />
            </RoleRoute>
          } />

          {/* Tickets (Module C) */}
          <Route path="/tickets"       element={<TicketPage />} />
          <Route path="/tickets/new"   element={<TicketCreate />} />
          <Route path="/tickets/:id"   element={<TicketDetails />} />

          {/* Notifications (Module D) */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Admin (Module E) */}
          <Route path="/admin"         element={<RoleRoute roles={['ADMIN']}><AdminPanel /></RoleRoute>} />
          <Route path="/admin/users"   element={<RoleRoute roles={['ADMIN']}><UserManagement /></RoleRoute>} />
          <Route path="/admin/tickets" element={<RoleRoute roles={['ADMIN']}><TicketPage /></RoleRoute>} />

        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

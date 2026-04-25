import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AppLayout    from './layouts/AppLayout'

// Auth
import Login         from './pages/auth/Login'
import Register      from './pages/auth/Register'
import OAuthCallback from './pages/auth/OAuthCallback'

// Dashboards
import Dashboard     from './pages/dashboard/Dashboard'
import UserDashboard from './pages/UserDashboard'

// Resources
import UserResourcesPage   from './pages/UserResourcesPage'
import ResourcesManagement from './pages/ResourcesManagement'

// Bookings
import CreateBooking   from './pages/bookings/CreateBooking'
import MyBookings      from './pages/bookings/MyBookings'
import BookingRequests from './pages/admin/BookingRequests'

// Notifications
import Notifications from './pages/notifications/Notifications'

// Admin
import AdminPanel     from './pages/admin/AdminPanel'
import UserManagement from './pages/admin/UserManagement'

// Tickets
import TicketPage    from './pages/tickets/TicketPage'
import TicketCreate  from './pages/tickets/TicketCreate'
import TicketDetails from './pages/tickets/TicketDetails'

// Guards
import PrivateRoute from './routes/PrivateRoute'
import RoleRoute    from './routes/RoleRoute'

// Smart redirect after login based on role
function RoleRedirect() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} } })()
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />
  return ['ADMIN', 'MANAGER'].includes(user?.role)
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/user/dashboard" replace />
}

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
        {/* ── Public ──────────────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"                element={<Navigate to="/login" replace />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
        </Route>

        {/* ── Smart redirect after login ───────────────────────────── */}
        <Route path="/home" element={<RoleRedirect />} />

        {/* ── All protected routes share one AppLayout ────────────── */}
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>

          {/* ── USER routes ─────────────────────────────────────────── */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/resources" element={<UserResourcesPage />} />

          {/* ── Booking routes (USER) ────────────────────────────────── */}
          <Route path="/bookings/create"            element={<CreateBooking />} />
          <Route path="/bookings/create/:resourceId" element={<CreateBooking />} />
          <Route path="/bookings/my"                element={<MyBookings />} />

          {/* ── Notifications ────────────────────────────────────────── */}
          <Route path="/notifications" element={<Notifications />} />

          {/* ── Tickets ──────────────────────────────────────────────── */}
          <Route path="/tickets"     element={<TicketPage />} />
          <Route path="/tickets/new" element={<TicketCreate />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />

          {/* ── ADMIN / MANAGER routes ───────────────────────────────── */}
          <Route path="/dashboard" element={
            <RoleRoute roles={['ADMIN', 'MANAGER']}><Dashboard /></RoleRoute>
          } />
          <Route path="/admin/resources" element={
            <RoleRoute roles={['ADMIN', 'MANAGER']}><ResourcesManagement /></RoleRoute>
          } />
          <Route path="/admin/bookings" element={
            <RoleRoute roles={['ADMIN', 'MANAGER']}><BookingRequests /></RoleRoute>
          } />
          <Route path="/admin/all-bookings" element={
            <RoleRoute roles={['ADMIN', 'MANAGER']}><BookingRequests /></RoleRoute>
          } />
          <Route path="/admin" element={
            <RoleRoute roles={['ADMIN']}><AdminPanel /></RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute roles={['ADMIN']}><UserManagement /></RoleRoute>
          } />
          <Route path="/admin/tickets" element={
            <RoleRoute roles={['ADMIN']}><TicketPage /></RoleRoute>
          } />

        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

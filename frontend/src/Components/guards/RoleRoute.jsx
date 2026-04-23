import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/**
 * Protects routes that require specific roles.
 * If authenticated but wrong role, redirects to /dashboard.
 *
 * Usage: <RoleRoute roles={['ADMIN', 'MANAGER']}><MyPage /></RoleRoute>
 */
const RoleRoute = ({ roles = [], children }) => {
  const { isLoggedIn, hasRole } = useAuth()

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!hasRole(...roles)) return <Navigate to="/dashboard" replace />

  return children
}

export default RoleRoute

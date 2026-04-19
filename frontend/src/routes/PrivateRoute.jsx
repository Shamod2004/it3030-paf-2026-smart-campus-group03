import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * Protects routes that require login.
 * If not authenticated, redirects to /login.
 */
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default PrivateRoute

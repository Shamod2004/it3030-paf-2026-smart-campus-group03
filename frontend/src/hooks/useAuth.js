import { useMemo } from 'react';

const useAuth = () => {
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  }

  const user       = getUser()
  const token      = localStorage.getItem('token')
  const isLoggedIn = !!token

  /**
   * Check if current user has any of the provided roles
   * Usage: hasRole('ADMIN') or hasRole('ADMIN', 'MANAGER')
   */
  const hasRole = (...roles) => roles.includes(user?.role)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return useMemo(() => ({ 
    user, 
    token, 
    isLoggedIn, 
    hasRole, 
    logout 
  }), [user?.id, token, isLoggedIn]);
}

export default useAuth

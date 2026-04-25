import api from './axiosInstance'

export const getAllUsers      = ()                => api.get('/admin/users')
export const getUserById      = (id)             => api.get(`/admin/users/${id}`)
export const getUsersByRole   = (role)           => api.get(`/admin/users/role/${role}`)
export const updateUserRole   = (id, role)       => api.patch(`/admin/users/${id}/role`, { role })
export const toggleUserStatus = (id, enabled)   => api.patch(`/admin/users/${id}/toggle-status`, { enabled })
export const deleteUser       = (id)             => api.delete(`/admin/users/${id}`)

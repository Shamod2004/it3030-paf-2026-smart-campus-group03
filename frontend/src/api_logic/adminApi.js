import api from './axiosInstance'

export const getAllUsers      = ()              => api.get('/admin/users')
export const updateUserRole   = (id, role)      => api.patch(`/admin/users/${id}/role`, { role })
export const toggleUserStatus = (id, enabled)   => api.patch(`/admin/users/${id}/status`, { enabled })

import api from './axiosInstance'

export const getAllTickets = () => api.get('/tickets')
export const getTicketById = (id) => api.get(`/tickets/${id}`)
export const createTicket = (ticketData) => api.post('/tickets', ticketData)
export const updateTicketStatus = (id, status, notes) => api.put(`/tickets/${id}/status`, { status, notes })
export const assignTechnician = (id, technicianId) => api.put(`/tickets/${id}/assign`, { technicianId })
export const getTechnicians = () => api.get('/tickets/technicians')
export const addComment = (id, content) => api.post(`/tickets/${id}/comments`, { content })
export const deleteTicket = (id) => api.delete(`/tickets/${id}`)
export const updateTicket = (id, ticketData) => api.put(`/tickets/${id}`, ticketData)

const ticketService = {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
    assignTechnician,
    getTechnicians,
    addComment
}

export default ticketService

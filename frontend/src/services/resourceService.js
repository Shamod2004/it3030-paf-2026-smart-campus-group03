import api from './axiosInstance'

const resourceService = {

  // GET /api/resources?page=&size=&sortBy=&sortDirection=
  getAllResources: (page = 0, size = 10, sortBy = 'updatedAt', sortDirection = 'DESC') =>
    api.get('/resources', { params: { page, size, sortBy, sortDirection } })
       .then(res => res.data),

  // GET /api/resources/{id}
  getResourceById: (id) =>
    api.get(`/resources/${id}`).then(res => res.data),

  // GET /api/resources/by-resource-id/{resourceId}
  getResourceByResourceId: (resourceId) =>
    api.get(`/resources/by-resource-id/${resourceId}`).then(res => res.data),

  // GET /api/resources/search?searchTerm=&page=&size=
  searchResources: (searchTerm, page = 0, size = 10) =>
    api.get('/resources/search', { params: { searchTerm, page, size } })
       .then(res => res.data),

  // GET /api/resources/filter?type=&status=&location=&minCapacity=&maxCapacity=&page=&size=
  filterResources: (filters, page = 0, size = 10) => {
    const params = { page, size }
    if (filters.type)        params.type        = filters.type
    if (filters.status)      params.status      = filters.status
    if (filters.location)    params.location    = filters.location
    if (filters.minCapacity) params.minCapacity = filters.minCapacity
    if (filters.maxCapacity) params.maxCapacity = filters.maxCapacity
    return api.get('/resources/filter', { params }).then(res => res.data)
  },

  // POST /api/resources
  createResource: (resource) =>
    api.post('/resources', resource).then(res => res.data),

  // PUT /api/resources/{id}
  updateResource: (id, resource) =>
    api.put(`/resources/${id}`, resource).then(res => res.data),

  // DELETE /api/resources/{id}
  deleteResource: (id) =>
    api.delete(`/resources/${id}`).then(res => res.data),

  // PATCH /api/resources/{id}/status?status=
  updateResourceStatus: (id, status) =>
    api.patch(`/resources/${id}/status`, null, { params: { status } })
       .then(res => res.data),

  // GET /api/resources/types/all
  getResourceTypes: () =>
    api.get('/resources/types/all').then(res => res.data),

  // GET /api/resources/statuses/all
  getResourceStatuses: () =>
    api.get('/resources/statuses/all').then(res => res.data),
}

export default resourceService

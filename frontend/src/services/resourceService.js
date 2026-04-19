// API Client Service for Resources Management
const API_BASE_URL = 'http://localhost:8081/api/resources';

// Mock storage for offline fallback
const mockStorage = {
  resources: [
    {
      id: 1,
      resourceId: 'R001',
      name: 'A404 - Main Lecture Hall',
      type: 'ROOM',
      capacity: 150,
      location: 'Academic Block A',
      description: 'Large lecture hall with projector and sound system',
      imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      status: 'ACTIVE',
      createdAt: '2026-01-15T10:00:00',
      updatedAt: '2026-04-18T14:30:00',
      totalBookings: 25,
    },
    {
      id: 2,
      resourceId: 'R002',
      name: 'Computer Lab 1',
      type: 'LAB',
      capacity: 40,
      location: 'Tech Building',
      description: 'Computer lab with 40 workstations and advanced software',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
      status: 'ACTIVE',
      createdAt: '2026-01-20T11:00:00',
      updatedAt: '2026-04-17T09:15:00',
      totalBookings: 35,
    },
    {
      id: 3,
      resourceId: 'R003',
      name: 'Projector Unit',
      type: 'EQUIPMENT',
      capacity: 1,
      location: 'Tech Building - Storage',
      description: '4K Projector with wireless connectivity',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      status: 'MAINTENANCE',
      createdAt: '2026-02-01T08:30:00',
      updatedAt: '2026-04-18T12:00:00',
      totalBookings: 12,
    },
  ],

  getAll: function() {
    return this.resources;
  },

  getById: function(id) {
    return this.resources.find(r => r.id === id);
  },

  getByResourceId: function(resourceId) {
    return this.resources.find(r => r.resourceId === resourceId);
  },

  add: function(resource) {
    const newResource = {
      ...resource,
      id: Math.max(...this.resources.map(r => r.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBookings: 0,
    };
    this.resources.push(newResource);
    return newResource;
  },

  update: function(id, updates) {
    const index = this.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.resources[index] = { ...this.resources[index], ...updates, updatedAt: new Date().toISOString() };
      return this.resources[index];
    }
    return null;
  },

  delete: function(id) {
    this.resources = this.resources.filter(r => r.id !== id);
  },

  search: function(term) {
    const lowerTerm = term.toLowerCase();
    return this.resources.filter(r =>
      r.name.toLowerCase().includes(lowerTerm) ||
      r.resourceId.toLowerCase().includes(lowerTerm) ||
      r.location.toLowerCase().includes(lowerTerm)
    );
  },

  filter: function(filters) {
    return this.resources.filter(r => {
      if (filters.type && r.type !== filters.type) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.location && !r.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minCapacity && r.capacity < filters.minCapacity) return false;
      if (filters.maxCapacity && r.capacity > filters.maxCapacity) return false;
      return true;
    });
  },
};

// Format API response
const formatResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      success: true,
      data: data,
      totalPages: 1,
      totalElements: data.length,
      currentPage: 0,
    };
  }
  return data;
};

const resourceService = {
  // Get all resources
  getAllResources: async (page = 0, size = 10, sortBy = 'updatedAt', sortDirection = 'DESC') => {
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources:', error);
      const all = mockStorage.getAll();
      return formatResponse(all);
    }
  },

  // Get resource by ID
  getResourceById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch resource');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resource:', error);
      const resource = mockStorage.getById(id);
      return { success: true, data: resource };
    }
  },

  // Get resource by resourceId
  getResourceByResourceId: async (resourceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/by-resource-id/${resourceId}`);
      if (!response.ok) throw new Error('Failed to fetch resource');
      return await response.json();
    } catch (error) {
      console.error('Error fetching resource:', error);
      const resource = mockStorage.getByResourceId(resourceId);
      return { success: true, data: resource };
    }
  },

  // Search resources
  searchResources: async (searchTerm, page = 0, size = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
      if (!response.ok) throw new Error('Failed to search resources');
      return await response.json();
    } catch (error) {
      console.error('Error searching resources:', error);
      const results = mockStorage.search(searchTerm);
      return formatResponse(results);
    }
  },

  // Filter resources
  filterResources: async (filters, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity);
      params.append('page', page);
      params.append('size', size);

      const response = await fetch(`${API_BASE_URL}/filter?${params}`);
      if (!response.ok) throw new Error('Failed to filter resources');
      return await response.json();
    } catch (error) {
      console.error('Error filtering resources:', error);
      const results = mockStorage.filter(filters);
      return formatResponse(results);
    }
  },

  // Create resource
  createResource: async (resource) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
      });
      if (!response.ok) throw new Error('Failed to create resource');
      return await response.json();
    } catch (error) {
      console.error('Error creating resource:', error);
      const newResource = mockStorage.add(resource);
      localStorage.setItem('smartcampus_resources', JSON.stringify(mockStorage.resources));
      return { success: true, message: 'Resource created', data: newResource };
    }
  },

  // Update resource
  updateResource: async (id, resource) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
      });
      if (!response.ok) throw new Error('Failed to update resource');
      return await response.json();
    } catch (error) {
      console.error('Error updating resource:', error);
      const updated = mockStorage.update(id, resource);
      localStorage.setItem('smartcampus_resources', JSON.stringify(mockStorage.resources));
      return { success: true, message: 'Resource updated', data: updated };
    }
  },

  // Delete resource
  deleteResource: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete resource');
      return await response.json();
    } catch (error) {
      console.error('Error deleting resource:', error);
      mockStorage.delete(id);
      localStorage.setItem('smartcampus_resources', JSON.stringify(mockStorage.resources));
      return { success: true, message: 'Resource deleted' };
    }
  },

  // Update resource status
  updateResourceStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status?status=${status}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to update status');
      return await response.json();
    } catch (error) {
      console.error('Error updating status:', error);
      const updated = mockStorage.update(id, { status });
      localStorage.setItem('smartcampus_resources', JSON.stringify(mockStorage.resources));
      return { success: true, message: 'Status updated', data: updated };
    }
  },

  // Get resource types
  getResourceTypes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/types/all`);
      if (!response.ok) throw new Error('Failed to fetch types');
      return await response.json();
    } catch (error) {
      console.error('Error fetching types:', error);
      return { success: true, data: ['ROOM', 'LAB', 'EQUIPMENT', 'FACILITY'] };
    }
  },

  // Get resource statuses
  getResourceStatuses: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statuses/all`);
      if (!response.ok) throw new Error('Failed to fetch statuses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching statuses:', error);
      return { success: true, data: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'] };
    }
  },

  // Initialize from localStorage if available
  initializeFromStorage: () => {
    try {
      const stored = localStorage.getItem('smartcampus_resources');
      if (stored) {
        mockStorage.resources = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },
};

// Initialize on load
resourceService.initializeFromStorage();

export default resourceService;

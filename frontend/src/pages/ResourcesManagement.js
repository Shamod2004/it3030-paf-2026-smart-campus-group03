import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ResourceForm from '../components/ResourceForm';
import ResourceDetails from '../components/ResourceDetails';
import resourceService from '../services/resourceService';
import '../styles/ResourcesManagement.css';

const ResourcesManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    minCapacity: '',
    maxCapacity: '',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Dropdowns
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Load initial data
  useEffect(() => {
    loadResources();
    loadLookups();
  }, []);

  // Load resources when filters/search/pagination changes
  useEffect(() => {
    loadResources();
  }, [currentPage, searchTerm, filters, sortBy, sortDirection]);

  const loadLookups = async () => {
    try {
      const [typesRes, statusesRes] = await Promise.all([
        resourceService.getResourceTypes(),
        resourceService.getResourceStatuses(),
      ]);
      setTypes(typesRes.data || []);
      setStatuses(statusesRes.data || []);
    } catch (err) {
      console.error('Error loading lookups:', err);
    }
  };

  const loadResources = async () => {
    setLoading(true);
    setError('');
    try {
      let response;

      if (searchTerm) {
        response = await resourceService.searchResources(searchTerm, currentPage, pageSize);
      } else if (Object.values(filters).some((f) => f)) {
        response = await resourceService.filterResources(filters, currentPage, pageSize);
      } else {
        response = await resourceService.getAllResources(currentPage, pageSize, sortBy, sortDirection);
      }

      if (response.success) {
        setResources(response.data);
        setTotalPages(response.totalPages);
      } else {
        setError('Failed to load resources');
      }
    } catch (err) {
      console.error('Error loading resources:', err);
      setError('Error loading resources');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (formData) => {
    try {
      const response = await resourceService.createResource(formData);
      if (response.success) {
        showSuccessMessage('Resource created successfully');
        setShowFormModal(false);
        setCurrentPage(0);
        loadResources();
      }
    } catch (err) {
      console.error('Error adding resource:', err);
      throw err;
    }
  };

  const handleUpdateResource = async (formData) => {
    try {
      const response = await resourceService.updateResource(selectedResource.id, formData);
      if (response.success) {
        showSuccessMessage('Resource updated successfully');
        setShowFormModal(false);
        setSelectedResource(null);
        loadResources();
      }
    } catch (err) {
      console.error('Error updating resource:', err);
      throw err;
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      const response = await resourceService.deleteResource(id);
      if (response.success) {
        showSuccessMessage('Resource deleted successfully');
        setShowDetailsModal(false);
        setCurrentPage(0);
        loadResources();
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      throw err;
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await resourceService.updateResourceStatus(id, newStatus);
      if (response.success) {
        showSuccessMessage('Status updated successfully');
        loadResources();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setShowDetailsModal(false);
    setShowFormModal(true);
  };

  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
    setShowDetailsModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      location: '',
      minCapacity: '',
      maxCapacity: '',
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: '#10B981',
      MAINTENANCE: '#F59E0B',
      INACTIVE: '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  const showSuccessMessage = (message) => {
    // You can replace this with a toast notification library
    alert(message);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOpenAddForm = () => {
    setSelectedResource(null);
    setShowFormModal(true);
  };

  return (
    <AdminLayout activeMenu="resources">
      <div className="resources-container">
        {/* Header Section */}
        <div className="page-header">
          <div>
            <h1>Manage Resources</h1>
            <p>Create, update, and monitor campus facilities</p>
          </div>
          <button className="btn-primary" onClick={handleOpenAddForm}>
            <Plus size={20} />
            Add Resource
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            Filters
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="filters-section">
            <div className="filter-row">
              <div className="filter-group">
                <label>Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Min Capacity</label>
                <input
                  type="number"
                  name="minCapacity"
                  placeholder="Minimum"
                  value={filters.minCapacity}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label>Max Capacity</label>
                <input
                  type="number"
                  name="maxCapacity"
                  placeholder="Maximum"
                  value={filters.maxCapacity}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>

              <div className="filter-group">
                <button
                  className="btn-secondary"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="table-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <p>No resources found</p>
              <button className="btn-primary" onClick={handleOpenAddForm}>
                <Plus size={20} />
                Create First Resource
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="resources-table">
                <thead>
                  <tr>
                    <th>Resource ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="resource-id">{resource.resourceId}</td>
                      <td className="resource-name">
                        {resource.imageUrl && (
                          <img src={resource.imageUrl} alt="" className="resource-thumbnail" />
                        )}
                        {resource.name}
                      </td>
                      <td>{resource.type}</td>
                      <td className="capacity">{resource.capacity}</td>
                      <td>{resource.location}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(resource.status) }}
                        >
                          {resource.status}
                        </span>
                      </td>
                      <td className="date">{formatDate(resource.updatedAt)}</td>
                      <td className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleViewDetails(resource)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleEditResource(resource)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => {
                            setSelectedResource(resource);
                            setShowDetailsModal(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ResourceForm
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedResource(null);
        }}
        onSubmit={selectedResource ? handleUpdateResource : handleAddResource}
        initialData={selectedResource}
        types={types}
        statuses={statuses}
      />

      <ResourceDetails
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
        onEdit={handleEditResource}
        onDelete={handleDeleteResource}
        onStatusChange={handleStatusChange}
      />
    </AdminLayout>
  );
};

export default ResourcesManagement;

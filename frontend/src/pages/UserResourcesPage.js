import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import ResourceCard from '../components/ResourceCard';
import BookingModal from '../components/BookingModal';
import resourceService from '../services/resourceService';
import '../styles/UserResourcesPage.css';

const UserResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    capacity: '',
    status: 'ACTIVE', // Only show available resources by default
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadResources();
    loadLookups();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, resources]);

  const loadLookups = async () => {
    try {
      const typesRes = await resourceService.getResourceTypes();
      setTypes(typesRes.data || []);
    } catch (err) {
      console.error('Error loading lookups:', err);
    }
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getAllResources(0, 50);
      if (response.success) {
        setResources(response.data);
      }
    } catch (err) {
      console.error('Error loading resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.location.toLowerCase().includes(term) ||
          r.type.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }

    // Capacity filter
    if (filters.capacity) {
      const capacity = parseInt(filters.capacity);
      filtered = filtered.filter((r) => r.capacity >= capacity);
    }

    // Status filter (only show active resources for users)
    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    } else {
      // Default: only show available
      filtered = filtered.filter((r) => r.status === 'ACTIVE');
    }

    setFilteredResources(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      capacity: '',
      status: 'ACTIVE',
    });
  };

  const handleBookNow = (resource) => {
    setSelectedResource(resource);
    setShowBookingModal(true);
  };

  const handleViewDetails = (resource) => {
    console.log('View details:', resource);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      console.log('Booking confirmed:', bookingData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowBookingModal(false);
    } catch (error) {
      throw new Error('Failed to confirm booking');
    }
  };

  const hasActiveFilters =
    searchTerm || filters.type || filters.capacity || filters.status !== 'ACTIVE';

  return (
    <UserLayout activeMenu="resources">
      <div className="user-resources-page">
        {/* Header Section */}
        <div className="page-header">
          <div>
            <h1>Browse Resources</h1>
            <p>Find and book available facilities for your needs</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, type, or location…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`filter-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="filters-section">
            <div className="filters-content">
              <div className="filter-group">
                <label>Resource Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Minimum Capacity</label>
                <select
                  name="capacity"
                  value={filters.capacity}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">Any Capacity</option>
                  <option value="10">10+ people</option>
                  <option value="25">25+ people</option>
                  <option value="50">50+ people</option>
                  <option value="100">100+ people</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Availability</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="ACTIVE">Available Only</option>
                  <option value="">All Status</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button className="btn-clear-filters" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing <strong>{filteredResources.length}</strong> resources
          </p>
        </div>

        {/* Resources Grid */}
        <div className="user-resources-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="empty-state">
              <p>No resources match your criteria</p>
              {hasActiveFilters && (
                <button className="btn-primary" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onBookNow={handleBookNow}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
        onConfirmBooking={handleConfirmBooking}
      />
    </UserLayout>
  );
};

export default UserResourcesPage;

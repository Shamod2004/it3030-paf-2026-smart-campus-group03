import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResourceCard from '../components/ResourceCard';
import ResourceDetails from '../components/ResourceDetails';
import resourceService from '../services/resourceService';
import '../styles/UserResourcesPage.css';

const UserResourcesPage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', capacity: '', status: 'ACTIVE' });
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [types, setTypes] = useState([]);

  useEffect(() => { loadResources(); loadLookups(); }, []);
  useEffect(() => { applyFilters(); }, [searchTerm, filters, resources]);

  const loadLookups = async () => {
    try {
      const typesRes = await resourceService.getResourceTypes();
      setTypes(typesRes.data || []);
    } catch (err) { console.error(err); }
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getAllResources(0, 50);
      if (response.success) setResources(response.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let filtered = resources;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term)
      );
    }
    if (filters.type)     filtered = filtered.filter(r => r.type === filters.type);
    if (filters.capacity) filtered = filtered.filter(r => r.capacity >= parseInt(filters.capacity));
    filtered = filtered.filter(r => filters.status ? r.status === filters.status : r.status === 'ACTIVE');
    setFilteredResources(filtered);
  };

  const handleFilterChange = e => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleClearFilters = () => { setSearchTerm(''); setFilters({ type: '', capacity: '', status: 'ACTIVE' }); };
  const handleBookNow    = resource => navigate(`/bookings/create/${resource.id}`);
  const handleViewDetails = resource => { setSelectedResource(resource); setShowDetailsModal(true); };

  const hasActiveFilters = searchTerm || filters.type || filters.capacity || filters.status !== 'ACTIVE';

  return (
    <div className="user-resources-page animate-fadeIn">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Browse Resources</h1>
          <p>Find and book available facilities for your needs</p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, type, or location…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className={`filter-button ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(f => !f)}
        >
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-content">
            <div className="filter-group">
              <label>Resource Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
                <option value="">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Minimum Capacity</label>
              <select name="capacity" value={filters.capacity} onChange={handleFilterChange} className="filter-select">
                <option value="">Any Capacity</option>
                <option value="10">10+ people</option>
                <option value="25">25+ people</option>
                <option value="50">50+ people</option>
                <option value="100">100+ people</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Availability</label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                <option value="ACTIVE">Available Only</option>
                <option value="">All Status</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button className="btn-clear-filters" onClick={handleClearFilters}>Clear Filters</button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="results-info">
        <p>Showing <strong>{filteredResources.length}</strong> resources</p>
      </div>

      {/* Grid */}
      <div className="user-resources-container">
        {loading ? (
          <div className="loading"><div className="spinner" /><p>Loading resources...</p></div>
        ) : filteredResources.length === 0 ? (
          <div className="empty-state">
            <p>No resources match your criteria</p>
            {hasActiveFilters && <button className="btn-primary" onClick={handleClearFilters}>Clear Filters</button>}
          </div>
        ) : (
          <div className="resources-grid">
            {filteredResources.map(resource => (
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

      {/* Details modal */}
      <ResourceDetails
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedResource(null); }}
        resource={selectedResource}
      />

    </div>
  );
};

export default UserResourcesPage;

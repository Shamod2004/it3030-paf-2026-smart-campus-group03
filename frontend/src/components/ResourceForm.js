import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import '../styles/ResourceForm.css';

const DEFAULT_TYPES = ['ROOM', 'LAB', 'EQUIPMENT', 'FACILITY'];
const DEFAULT_STATUSES = ['ACTIVE', 'MAINTENANCE', 'INACTIVE'];

const ResourceForm = ({ isOpen, onClose, onSubmit, initialData = null, types = [], statuses = [] }) => {
  const [formData, setFormData] = useState({
    resourceId: '',
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const resourceTypes = types.length > 0 ? types : DEFAULT_TYPES;
  const resourceStatuses = statuses.length > 0 ? statuses : DEFAULT_STATUSES;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.imageUrl || '');
    } else {
      setFormData({
        resourceId: '',
        name: '',
        type: '',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        description: '',
        imageUrl: '',
      });
      setImagePreview('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resourceId.trim()) newErrors.resourceId = 'Resource ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Valid capacity is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save resource' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      resourceId: '',
      name: '',
      type: '',
      capacity: '',
      location: '',
      status: 'ACTIVE',
      description: '',
      imageUrl: '',
    });
    setImagePreview('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay">
      <div className="form-modal">
        {/* Header */}
        <div className="form-header">
          <h2>{initialData ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="resource-form">
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="form-row">
            {/* Resource ID */}
            <div className="form-group">
              <label htmlFor="resourceId">Resource ID *</label>
              <input
                id="resourceId"
                type="text"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleInputChange}
                placeholder="e.g., R001"
                disabled={!!initialData}
                className={errors.resourceId ? 'input-error' : ''}
              />
              {errors.resourceId && <span className="field-error">{errors.resourceId}</span>}
            </div>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Resource Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Lecture Hall A"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          </div>

          <div className="form-row">
            {/* Type */}
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={errors.type ? 'input-error' : ''}
              >
                <option value="">Select Type</option>
                {resourceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && <span className="field-error">{errors.type}</span>}
            </div>

            {/* Capacity */}
            <div className="form-group">
              <label htmlFor="capacity">Capacity *</label>
              <input
                id="capacity"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                min="1"
                className={errors.capacity ? 'input-error' : ''}
              />
              {errors.capacity && <span className="field-error">{errors.capacity}</span>}
            </div>
          </div>

          <div className="form-row">
            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Building A, Floor 4"
                className={errors.location ? 'input-error' : ''}
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={errors.status ? 'input-error' : ''}
              >
                {resourceStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && <span className="field-error">{errors.status}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed description..."
              rows="4"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Resource Image</label>
            <div className="image-upload">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image" className="upload-label">
                <Upload size={20} />
                <span>Click to upload or drag and drop</span>
              </label>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData((prev) => ({ ...prev, imageUrl: '' }));
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;

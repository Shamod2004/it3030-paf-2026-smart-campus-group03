import React, { useState } from 'react';
import { X } from 'lucide-react';
import './TicketPage.css';

const TicketFormPanel = ({ onTicketCreated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    relatedResource: '',
    priority: 'MEDIUM',
    issueType: '',
    location: '',
    attachments: [], // Changed from attachment to attachments (array)
    contactName: '',
    contactNumber: '',
    contactEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (/\d/.test(value)) {
          error = 'Title cannot contain numbers';
        }
        break;
      
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        }
        break;
      
      case 'relatedResource':
        if (!value) {
          error = 'Please select a related resource';
        }
        break;
      
      case 'issueType':
        if (!value) {
          error = 'Please select an issue type';
        }
        break;
      
      case 'location':
        if (!value.trim()) {
          error = 'Location is required';
        }
        break;
      
      case 'contactName':
        if (!value.trim()) {
          error = 'Contact name is required';
        } else if (/\d/.test(value)) {
          error = 'Contact name cannot contain numbers';
        }
        break;
      
      case 'contactNumber':
        if (!value.trim()) {
          error = 'Contact number is required';
        } else if (!/^\d{10}$/.test(value.replace(/\s/g, ''))) {
          error = 'Contact number must be exactly 10 digits';
        }
        break;
      
      case 'contactEmail':
        if (!value.trim()) {
          error = 'Contact email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'attachments' && key !== 'priority') { // Skip attachments and priority (has default)
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = type === 'file' ? (name === 'attachments' ? Array.from(files) : (files[0] || null)) : value;

    // Real-time validation for contact fields and title
    if (['contactName', 'contactNumber', 'contactEmail', 'title'].includes(name)) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      // Clear error for other fields when user starts typing
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new ticket object
      const newTicket = {
        id: Date.now(), // Temporary ID
        ticketId: `INC-${1000 + Math.floor(Math.random() * 900)}`,
        title: formData.title,
        description: formData.description,
        relatedResource: formData.relatedResource,
        priority: formData.priority,
        issueType: formData.issueType,
        category: formData.issueType, // Map Issue Type to Category
        location: formData.location,
        contactName: formData.contactName,
        contactNumber: formData.contactNumber,
        contactEmail: formData.contactEmail,
        attachments: formData.attachments, // Add attachments array
        status: 'Open', // Default status
        submittedBy: 'Current User',
        assignedTechnician: 'Not assigned', // Default technician
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call parent callback
      onTicketCreated(newTicket);

      // Reset form
      setFormData({
        title: '',
        description: '',
        relatedResource: '',
        priority: 'MEDIUM',
        issueType: '',
        location: '',
        attachments: [], // Reset to empty array
        contactName: '',
        contactNumber: '',
        contactEmail: ''
      });
      setErrors({});

    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Form Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter ticket title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Issue Type Field */}
            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type <span className="text-red-500">*</span>
              </label>
              <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.issueType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select issue type</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Network</option>
                <option value="facility">Facility</option>
                <option value="other">Other</option>
              </select>
              {errors.issueType && (
                <p className="mt-1 text-sm text-red-600">{errors.issueType}</p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Room 201, Lab 302"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Priority Field */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Related Resource Field */}
            <div>
              <label htmlFor="relatedResource" className="block text-sm font-medium text-gray-700 mb-2">
                Related Resource <span className="text-red-500">*</span>
              </label>
              <select
                id="relatedResource"
                name="relatedResource"
                value={formData.relatedResource}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.relatedResource ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select related resource</option>
                <option value="Epson EB-X51 Projector (Room 302)">Epson EB-X51 Projector (Room 302)</option>
                <option value="Network Switch A (Building B)">Network Switch A (Building B)</option>
              </select>
              {errors.relatedResource && (
                <p className="mt-1 text-sm text-red-600">{errors.relatedResource}</p>
              )}
            </div>

            {/* Attachment Field */}
            <div>
              <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  multiple
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {formData.attachments.length} file(s) selected
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the issue in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Preferred Contact Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Preferred Contact Name */}
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.contactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact name"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                  )}
                </div>

                {/* Preferred Contact Number */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                  )}
                </div>

                {/* Preferred Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    title: '',
                    description: '',
                    relatedResource: '',
                    priority: 'MEDIUM',
                    issueType: '',
                    location: '',
                    attachments: [], // Reset to empty array
                    contactName: '',
                    contactNumber: '',
                    contactEmail: ''
                  })}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketFormPanel;

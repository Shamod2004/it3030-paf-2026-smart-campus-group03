import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ticketService from '../../services/ticketService';
import './tickets.css';

const TicketCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    resourceLocation: '',
    priority: 'MEDIUM',
    preferredContact: ''
  });
  const [files, setFiles] = useState([]);

  const categories = ['AV/Projector', 'Electrical', 'Plumbing', 'Network/Wifi', 'Furniture', 'Other'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];



  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters long';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.description || formData.description.length < 10) newErrors.description = 'Please provide a more detailed description (min 10 chars)';
    if (!formData.resourceLocation) newErrors.resourceLocation = 'Location is required';
    if (!formData.preferredContact) newErrors.preferredContact = 'Contact details are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('ticket', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
      
      files.forEach(file => {
        submitData.append('files', file);
      });

      await ticketService.createTicket(submitData);
      toast.success('Ticket created successfully');
      navigate('/tickets');
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-container">
      
      {/* Header matching wireframe */}
      <div className="ticket-header" style={{ justifyContent: 'flex-start' }}>
        <button className="btn-secondary" onClick={() => navigate('/tickets')} style={{ border: 'none', paddingLeft: 0 }}>
          &larr; Back to Tickets
        </button>
        <div style={{ marginLeft: '1rem' }}>
          <h2 className="ticket-header-title">Create New Ticket</h2>
          <p className="ticket-header-sub">Fill in the details below to create a new support ticket</p>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="ticket-card" style={{ padding: '2rem' }}>
        <div className="form-grid">
          
          {/* Row 1 */}
          <div className="form-group">
            <label className="form-label">Title <span className="req">*</span></label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter ticket title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Issue Type <span className="req">*</span></label>
            <select
              className={`form-select ${errors.category ? 'error' : ''}`}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="" disabled>Select issue type</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <label className="form-label">Location <span className="req">*</span></label>
            <input
              type="text"
              className={`form-input ${errors.resourceLocation ? 'error' : ''}`}
              placeholder="e.g., Room 201, Lab 302"
              value={formData.resourceLocation}
              onChange={(e) => setFormData({ ...formData, resourceLocation: e.target.value })}
            />
            {errors.resourceLocation && <span className="error-message">{errors.resourceLocation}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              {priorities.map(p => (
                <option key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Row 3 */}
          <div className="form-group">
            <label className="form-label">Contact Details <span className="req">*</span></label>
            <input
              type="text"
              className={`form-input ${errors.preferredContact ? 'error' : ''}`}
              placeholder="Provide contact number or email"
              value={formData.preferredContact}
              onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
            />
            {errors.preferredContact && <span className="error-message">{errors.preferredContact}</span>}
          </div>

          <div className="form-group">
             <label className="form-label">Attachments</label>
             <input
               type="file"
               multiple
               accept="image/*"
               className="form-input"
               onChange={(e) => setFiles(Array.from(e.target.files))}
               style={{ padding: '0.6rem 1rem' }}
             />
             {files.length > 0 && (
               <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                 {files.length} file(s) selected
               </div>
             )}
          </div>

          {/* Row 4 - Full Width */}
          <div className="form-group full-width">
            <label className="form-label">Description <span className="req">*</span></label>
            <textarea
              rows="5"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              style={{ resize: 'vertical' }}
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button disabled={loading} type="submit" className="btn-primary">
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketCreate;

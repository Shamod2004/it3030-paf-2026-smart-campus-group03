import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ticketService from '../../services/ticketService';
import useAuth from '../../hooks/useAuth';
import './tickets.css';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    resourceLocation: ''
  });

  useEffect(() => {
    fetchTicket();
    if (user?.role === 'ADMIN') {
      fetchTechnicians();
    }
  }, [id, user]);

  const fetchTicket = async () => {
    try {
      const { data } = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (error) {
      toast.error('Failed to load ticket data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data } = await ticketService.getTechnicians();
      setTechnicians(data);
    } catch (error) {}
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await ticketService.addComment(id, comment);
      setComment('');
      fetchTicket();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleStatusUpdate = async (status) => {
    if ((status === 'RESOLVED' || status === 'REJECTED') && !statusNotes.trim()) {
      toast.error(`Please provide ${status === 'RESOLVED' ? 'resolution notes' : 'rejection reason'}`);
      return;
    }
    try {
      await ticketService.updateTicketStatus(id, status, statusNotes);
      toast.success(`Ticket marked as ${status.replace('_', ' ')}`);
      setStatusNotes('');
      fetchTicket();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleAssign = async () => {
    if (!selectedTech) return;
    try {
      await ticketService.assignTechnician(id, selectedTech);
      toast.success('Technician assigned successfully');
      fetchTicket();
    } catch (error) {
      toast.error('Assignment failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
    try {
      await ticketService.deleteTicket(id);
      toast.success('Ticket deleted successfully');
      navigate('/tickets');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!editForm.title || editForm.title.length < 5) newErrors.title = 'Title must be at least 5 chars';
    if (!editForm.description || editForm.description.length < 10) newErrors.description = 'Description must be at least 10 chars';
    if (!editForm.resourceLocation) newErrors.resourceLocation = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }
    try {
      await ticketService.updateTicket(id, editForm);
      toast.success('Ticket updated successfully');
      setIsEditing(false);
      fetchTicket();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const startEditing = () => {
    setEditForm({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      resourceLocation: ticket.resourceLocation
    });
    setIsEditing(true);
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner"></div>
      <p>Loading ticket details...</p>
    </div>
  );

  if (!ticket) return (
    <div className="ticket-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Ticket Not Found</h2>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The ticket you're looking for doesn't exist or you don't have access.</p>
      <button onClick={() => navigate('/tickets')} className="btn-primary">
        Back to Dashboard
      </button>
    </div>
  );

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const isTechnician = user?.role === 'TECHNICIAN' && ticket.technician?.id === user.id;

  const getBadgeClass = (status) => {
    switch (status) {
      case 'OPEN': return 'badge badge-open';
      case 'IN_PROGRESS': return 'badge badge-progress';
      case 'RESOLVED': return 'badge badge-resolved';
      case 'CLOSED': return 'badge badge-closed';
      case 'REJECTED': return 'badge badge-rejected';
      default: return 'badge badge-closed';
    }
  };

  return (
    <div className="ticket-container">
      
      {/* Rejection Banner */}
      {ticket.status === 'REJECTED' && (
        <div className="ticket-card animate-fadeIn" style={{ borderColor: 'rgba(239, 68, 68, 0.5)', background: 'rgba(239, 68, 68, 0.05)', marginBottom: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ background: '#ef4444', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             <svg style={{ width: '24px', height: '24px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#f87171', fontSize: '1.1rem' }}>Rejection Notice</h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: '#cbd5e1' }}>{ticket.rejectionReason || 'This ticket was rejected by the administration.'}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="ticket-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            &larr; Back
          </button>
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>TKT-{ticket.id.toString().padStart(4, '0')}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-text-muted)' }}></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{ticket.title}</h2>
          </div>
        </div>
        <div className={getBadgeClass(ticket.status)}>
          Status: {ticket.status.replace('_', ' ')}
        </div>
      </div>



      {isEditing ? (
        <div className="ticket-card animate-fadeIn">
          <h3 style={{ marginBottom: '1.5rem' }}>Update Ticket Information</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Ticket Title</label>
                <input 
                  type="text" 
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  value={editForm.title} 
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select" 
                  value={editForm.category} 
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                >
                  <option value="AV/Projector">AV/Projector</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Network/Wifi">Network/Wifi</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  className="form-select" 
                  value={editForm.priority} 
                  onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className={`form-input ${errors.resourceLocation ? 'error' : ''}`}
                  value={editForm.resourceLocation} 
                  onChange={(e) => setEditForm({...editForm, resourceLocation: e.target.value})} 
                />
                {errors.resourceLocation && <span className="error-message">{errors.resourceLocation}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea 
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  rows="4"
                  value={editForm.description} 
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})} 
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="ticket-layout-main">
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="ticket-card">
              {/* Metadata Grid */}
              <div className="form-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                 <div>
                   <p className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Priority</p>
                   <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0', color: ticket.priority === 'URGENT' ? 'var(--color-danger)' : 'var(--color-text)' }}>{ticket.priority}</p>
                 </div>
                 <div>
                   <p className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Category</p>
                   <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0' }}>{ticket.category}</p>
                 </div>
                 <div>
                   <p className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</p>
                   <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0' }}>{ticket.resourceLocation}</p>
                 </div>
              </div>

              {/* Admin Actions in Card */}
              {user?.role === 'ADMIN' && !isEditing && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid var(--color-surface-light)', width: 'fit-content', marginLeft: 'auto' }}>
                  <button onClick={startEditing} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    Edit Ticket
                  </button>
                  <button onClick={handleDelete} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Delete
                  </button>
                </div>
              )}
              
              {/* Description */}
              <div className="ticket-divider" style={{ margin: '0 -1.5rem 1.5rem', width: 'calc(100% + 3rem)' }}></div>
              <div>
                 <p className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</p>
                 <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--color-surface-light)' }}>
                   <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                 </div>
              </div>

              {/* Attachments */}
              {ticket.attachments?.length > 0 && (
                <>
                  <div className="ticket-divider" style={{ margin: '1.5rem -1.5rem', width: 'calc(100% + 3rem)' }}></div>
                  <div>
                    <p className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Attachments</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                      {ticket.attachments.map((att) => (
                        <a key={att.id} href={att.imageUrl} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--color-border)', height: '100px' }}>
                           <img src={att.imageUrl} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Comments */}
            <div className="ticket-card">
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff' }}>Discussion</h3>
              
              <div className="comments-list">
                {ticket.comments.map((c) => (
                  <div key={c.id} className={`comment-wrapper ${c.author.id === user.id ? 'mine' : ''}`}>
                    <div className="comment-header">
                       <span className="comment-author">{c.author.name}</span>
                       <span>{format(new Date(c.createdAt), 'MMM dd, h:mm a')}</span>
                    </div>
                    <div className="comment-bubble">
                      <p className="comment-text">{c.content}</p>
                    </div>
                  </div>
                ))}
                {ticket.comments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--color-border)', borderRadius: '0.75rem' }}>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No comments yet. Start the discussion below.</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="comment-box">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Send</button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Reporter Info */}
            <div className="ticket-card">
              <h4 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid var(--color-surface-light)', paddingBottom: '0.75rem' }}>Reporter Details</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                   {ticket.creator.name.charAt(0)}
                 </div>
                 <div>
                   <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{ticket.creator.name}</p>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{ticket.creator.email}</p>
                 </div>
              </div>

            </div>

            {/* Process Flow */}
            <div className="ticket-card">
              <h4 style={{ margin: '0 0 1.5rem 0', borderBottom: '1px solid var(--color-surface-light)', paddingBottom: '0.75rem' }}>Ticket Lifecycle</h4>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot-wrapper">
                     <div className="timeline-dot active"></div>
                     <div className="timeline-line"></div>
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-title">Ticket Created</p>
                    <p className="timeline-date">{format(new Date(ticket.createdAt), 'MMM dd, HH:mm')}</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot-wrapper">
                     <div className={`timeline-dot ${ticket.technician ? 'warning' : ''}`}></div>
                     <div className="timeline-line"></div>
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-title" style={{ color: ticket.technician ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Technician Assigned</p>
                    <p className="timeline-date" style={{ color: ticket.technician ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>{ticket.technician ? ticket.technician.name : 'Pending Assignment'}</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot-wrapper">
                     <div className={`timeline-dot ${['RESOLVED', 'CLOSED'].includes(ticket.status) ? 'success' : ''}`}></div>
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-title" style={{ color: ['RESOLVED', 'CLOSED'].includes(ticket.status) ? 'var(--color-text)' : 'var(--color-text-muted)' }}>Resolution</p>
                    {ticket.status === 'RESOLVED' && <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.35rem', margin: '0.25rem 0 0 0' }}>{ticket.resolutionNotes}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin / Manager Controls */}
            {isAdmin && ticket.status !== 'REJECTED' && (ticket.status === 'OPEN' || !ticket.technician) && (
              <div className="ticket-card" style={{ borderColor: 'rgba(99, 102, 241, 0.6)', background: 'rgba(99, 102, 241, 0.05)' }}>
                <h4>
                  Technician Assignment</h4>
                <div className="form-group">
                   <label className="form-label" style={{ fontSize: '0.8rem' }}>Assign Technician</label>
                   <select 
                    className="form-select"
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    style={{ background: '#0f172a' }}
                  >
                    <option value="">Select Technician..</option>
                    {technicians.map(t => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
                  </select>
                  {technicians.length === 0 && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-danger)', marginTop: '0.4rem' }}>
                      * No users with 'TECHNICIAN' role found in system.
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleAssign} 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', margin: '1rem 0', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
                  disabled={technicians.length === 0}
                >
                  Confirm Assignment
                </button>
                
                <div className="ticket-divider" style={{ margin: '1rem 0' }}></div>
                <div className="form-group">
                   <textarea
                    className="form-textarea"
                    placeholder="Reason for rejection (optional)"
                    rows="2"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  ></textarea>
                  <button onClick={() => handleStatusUpdate('REJECTED')} className="btn-secondary" style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.5)', marginTop: '0.5rem' }}>
                    Reject Ticket
                  </button>
                </div>
              </div>
            )}
            {/* Admin Verification (Close Ticket) */}
            {isAdmin && ticket.status === 'RESOLVED' && (
              <div className="ticket-card" style={{ borderColor: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Admin Verification
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Technician has resolved this ticket. Please verify the resolution and mark as officially closed.
                </p>
                <button 
                  onClick={() => handleStatusUpdate('CLOSED')} 
                  className="btn-primary" 
                  style={{ width: '100%', background: 'var(--color-success)', justifyContent: 'center' }}
                >
                  Mark as Closed
                </button>
              </div>
            )}

            {/* Technician Controls */}
            {isTechnician && (ticket.status === 'IN_PROGRESS' || ticket.status === 'OPEN') && (
              <div className="ticket-card" style={{ borderColor: 'rgba(245, 158, 11, 0.5)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-warning)' }}>Technician Actions</h4>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Resolution Notes</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Detail the steps taken to resolve..."
                    rows="3"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  ></textarea>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => handleStatusUpdate('RESOLVED')} className="btn-primary" style={{ background: 'var(--color-success)' }}>
                    Resolve
                  </button>
                  <button onClick={() => handleStatusUpdate('CLOSED')} className="btn-secondary">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;

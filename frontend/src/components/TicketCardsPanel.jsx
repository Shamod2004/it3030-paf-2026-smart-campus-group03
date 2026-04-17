import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, MessageSquare, Edit, Trash2, Calendar } from 'lucide-react';
import TicketDetailsModal from './TicketDetailsModal';
import CommentModal from './CommentModal';
import AttachFileModal from './AttachFileModal';
import EditTicketModal from './EditTicketModal';
import './TicketPage.css';

const TicketCardsPanel = ({ tickets, loading, onTicketUpdate }) => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [comments, setComments] = useState([]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Action handlers
  const handleViewDetails = (ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const handleAttachFile = (ticket) => {
    setSelectedTicket(ticket);
    setShowAttachModal(true);
  };

  const handleComment = (ticket) => {
    setSelectedTicket(ticket);
    setShowCommentModal(true);
  };

  const handleCommentAdded = (newComment) => {
    console.log('New comment added:', newComment);
    // Store comments for this ticket
    setComments(prevComments => [...prevComments, newComment]);
    
    // Update the ticket to show it has comments (optional enhancement)
    if (onTicketUpdate) {
      onTicketUpdate({
        ...selectedTicket,
        hasComments: true,
        lastComment: newComment
      });
    }
  };

  const handleUploadSuccess = (uploadedFile) => {
    console.log('File uploaded successfully:', uploadedFile);
    // Here you could update the ticket's attachments list
    // For now, we'll just log the success
    // In a real implementation, you might:
    // 1. Update local state to show the new attachment
    // 2. Call a prop function to update parent component
    // 3. Refresh ticket data from API
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setShowEditModal(true);
  };

  const handleDelete = async (ticket) => {
    console.log('🚀 [API CALL] Starting ticket deletion - API Call Verification');
    console.log('⏰ [API] Timestamp:', new Date().toISOString());
    console.log('🎫 [API] Ticket to delete:', ticket);
    
    const confirmed = window.confirm(`Are you sure you want to delete ticket ${ticket.ticketId}?`);
    if (confirmed) {
      console.log('✅ [CONFIRMATION] User confirmed ticket deletion');
      console.log('???? [API] Endpoint: DELETE /api/dashboard/tickets/' + ticket.id);
      console.log('📡 [API] Sending DELETE request to backend...');

      try {
        // Real API call
        const response = await fetch(`/api/dashboard/tickets/${ticket.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log('📥 [API] Response received:');
        console.log('  - Status Code:', response.status);
        console.log('  - Status Text:', response.statusText);
        console.log('  - Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          console.log('✅ [API] Ticket deleted successfully:', ticket.ticketId);
          
          // Call parent callback to update state
          console.log('🔄 [STATE] Calling onTicketUpdate callback to refresh list');
          if (onTicketUpdate) {
            onTicketUpdate({ ...ticket, deleted: true });
          }

          // Verify state update
          setTimeout(() => {
            console.log('✅ [STATE] Parent component should have removed ticket from list');
          }, 100);

          alert('Ticket deleted successfully!');
          console.log('✅ [UI] Success message displayed');
        } else {
          console.error('❌ [API] Failed to delete ticket - Status:', response.status, response.statusText);
          
          // Try to get error details
          let errorDetails = 'Unknown error';
          try {
            const errorData = await response.json();
            errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
          } catch (e) {
            errorDetails = await response.text();
          }
          console.error('❌ [API] Error details:', errorDetails);
          alert(`Failed to delete ticket: ${errorDetails}`);
        }

      } catch (error) {
        console.error('💥 [API ERROR] Error deleting ticket:', error);
        console.error('💥 [API ERROR] Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        alert(`Failed to delete ticket: ${error.message}`);
      } finally {
        console.log('🏁 [API] Ticket deletion process completed');
      }
    } else {
      console.log('❌ [CONFIRMATION] User cancelled ticket deletion');
    }
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowCommentModal(false);
    setShowEditModal(false);
    setShowAttachModal(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4 w-20"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">No tickets</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
        <p className="text-gray-500">Create your first ticket using the form above.</p>
      </div>
    );
  }

  // Remove duplicate tickets based on ID
  const uniqueTickets = tickets.filter((ticket, index) => 
    tickets.findIndex(t => t.id === ticket.id) === index
  );

  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueTickets.map((ticket) => (
          <div key={`ticket-card-${ticket.id}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Ticket Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{ticket.ticketId}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {ticket.createdDate?.split('T')[0] || ticket.createdDate}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>

            {/* Ticket Title */}
            <h4 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
              {ticket.title}
            </h4>

            {/* Ticket Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {ticket.description}
            </p>

            {/* Related Resource */}
            {ticket.relatedResource && (
              <div className="mb-4">
                <span className="text-xs text-gray-500">Related Resource:</span>
                <p className="text-sm text-gray-700">{ticket.relatedResource}</p>
              </div>
            )}

            {/* Category */}
            {ticket.category && (
              <div className="mb-4">
                <span className="text-xs text-gray-500">Category:</span>
                <p className="text-sm text-gray-700">{ticket.category}</p>
              </div>
            )}

            {/* Status and Assignment */}
            <div className="flex justify-between items-center mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <div className="text-sm text-gray-500">
                <span className="text-xs">Assigned to:</span>
                <p className="font-medium text-gray-700">{ticket.assignedTechnician || 'Unassigned'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {/* View Details Button - Full width on new line */}
              <button
                onClick={() => handleViewDetails(ticket)}
                className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                View Details
              </button>

              {/* Icon Actions Row */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {/* Attach File - Always visible */}
                  <button
                    onClick={() => handleAttachFile(ticket)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Comment - Always visible */}
                  <button
                    onClick={() => handleComment(ticket)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Add Comment"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit and Delete - Only for Open status */}
                {ticket.status === 'OPEN' && (
                  <div className="flex gap-2">
                    {/* Edit - Only for Open status */}
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit Ticket"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete - Only for Open status */}
                    <button
                      onClick={() => handleDelete(ticket)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <TicketDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseModals}
        ticket={selectedTicket}
      />

      <CommentModal
        isOpen={showCommentModal}
        onClose={handleCloseModals}
        ticket={selectedTicket}
        onCommentAdded={handleCommentAdded}
      />

      <AttachFileModal
        isOpen={showAttachModal}
        onClose={handleCloseModals}
        ticket={selectedTicket}
        onUploadSuccess={handleUploadSuccess}
      />

      <EditTicketModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        ticket={selectedTicket}
        onTicketUpdate={onTicketUpdate}
      />
    </Fragment>
  );
};

export default TicketCardsPanel;

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EditTicketModal = ({ isOpen, onClose, ticket, onTicketUpdate }) => {
  // Debug: Log received props
  console.log('?? [PROPS] EditTicketModal received props:', {
    isOpen,
    hasTicket: !!ticket,
    ticketId: ticket?.id,
    onTicketUpdate: typeof onTicketUpdate,
    onTicketUpdateFunction: onTicketUpdate
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    relatedResource: '',
    priority: 'MEDIUM'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        description: ticket.description || '',
        relatedResource: ticket.relatedResource || '',
        priority: ticket.priority || 'MEDIUM'
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 [API CALL] Starting ticket update - API Call Verification');
    console.log('⏰ [API] Timestamp:', new Date().toISOString());
    console.log('🎫 [API] Original ticket:', ticket);
    
    if (!formData.title.trim() || !formData.description.trim()) {
      console.log('❌ [VALIDATION] Form validation failed - missing required fields');
      alert('Please fill in all required fields');
      return;
    }
    console.log('✅ [VALIDATION] Form validation passed');

    setIsSubmitting(true);
    console.log('🔄 [STATE] Submitting state set to true');

    try {
      // Format date fields properly
      const formatDateTime = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19); // yyyy-MM-dd'T'HH:mm:ss
      };

      const updatedData = { ...formData };
      
      // Format any date fields if they exist
      if (formData.createdDate) {
        updatedData.createdDate = formatDateTime(formData.createdDate);
      }
      if (formData.updatedDate) {
        updatedData.updatedDate = formatDateTime(formData.updatedDate);
      }

      const updatedTicket = {
        ...ticket,
        ...updatedData,
        updatedDate: new Date().toISOString().slice(0, 19) // Ensure updatedDate is always set
      };

      console.log('📤 [API] Updated ticket data to be sent:', updatedTicket);
      console.log('📍 [API] Endpoint: PUT http://localhost:8080/api/dashboard/tickets/' + ticket.id);
      console.log('📡 [API] Sending PUT request to backend...');

      // Real API call
      const response = await fetch(`http://localhost:8080/api/dashboard/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedTicket)
      });

      console.log('📥 [API] Response received:');
      console.log('  - Status Code:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - Headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const updatedTicketResponse = await response.json();
        console.log('✅ [API] Ticket updated successfully:', updatedTicketResponse);
        console.log('📊 [API] Response data type:', typeof updatedTicketResponse);

        // Call parent callback with backend response
        console.log('?? [STATE] Calling onTicketUpdate callback');
        if (onTicketUpdate && typeof onTicketUpdate === 'function') {
          onTicketUpdate(updatedTicketResponse);
        } else {
          console.warn('?? [WARNING] onTicketUpdate is not a function or not provided');
        }

        // Verify state update
        setTimeout(() => {
          console.log('✅ [STATE] Parent component should have updated with modified ticket');
        }, 100);

        alert('Ticket updated successfully!');
        console.log('✅ [UI] Success message displayed');
        
        onClose();
        console.log('🔒 [UI] Modal closed');
      } else {
        console.error('❌ [API] Failed to update ticket - Status:', response.status, response.statusText);
        
        // Try to get error details
        let errorDetails = 'Unknown error';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          errorDetails = await response.text();
        }
        console.error('❌ [API] Error details:', errorDetails);
        alert(`Failed to update ticket: ${errorDetails}`);
      }

    } catch (error) {
      console.error('💥 [API ERROR] Error updating ticket:', error);
      console.error('💥 [API ERROR] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Failed to update ticket: ${error.message}`);
    } finally {
      console.log('🏁 [API] Ticket update process completed');
      setIsSubmitting(false);
      console.log('🔄 [STATE] Submitting state set to false');
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Edit Ticket</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ticket info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{ticket.ticketId}</h4>
            <p className="text-sm text-gray-700">Status: {ticket.status.replace('_', ' ')}</p>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Related Resource Field */}
              <div>
                <label htmlFor="relatedResource" className="block text-sm font-medium text-gray-700 mb-2">
                  Related Resource
                </label>
                <input
                  type="text"
                  id="relatedResource"
                  name="relatedResource"
                  value={formData.relatedResource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
            </div>

            {/* Modal footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;

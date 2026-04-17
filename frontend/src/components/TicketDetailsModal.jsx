import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Wrench, Tag, FileText, AlertCircle, Paperclip } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';

const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
  const [loading, setLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(ticket);
  const [imagePreview, setImagePreview] = useState({ isOpen: false, imageUrl: '', fileName: '' });

  useEffect(() => {
    const fetchFullTicketDetails = async () => {
      if (!ticket?.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/dashboard/tickets/${ticket.id}`);
        if (response.ok) {
          const fullTicket = await response.json();
          setTicketDetails(fullTicket);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && ticket?.id) {
      fetchFullTicketDetails();
    }
  }, [isOpen, ticket]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-800 border border-red-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      LOW: 'bg-gray-100 text-gray-800 border border-gray-200',
      CRITICAL: 'bg-red-200 text-red-900 border border-red-300',
    };
    return colors[priority?.toUpperCase()] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getStatusBadge = (status) => {
    const colors = {
      OPEN: 'bg-blue-100 text-blue-800 border border-blue-200',
      IN_PROGRESS: 'bg-orange-100 text-orange-800 border border-orange-200',
      RESOLVED: 'bg-green-100 text-green-800 border border-green-200',
      CLOSED: 'bg-gray-100 text-gray-800 border border-gray-200',
      REJECTED: 'bg-red-100 text-red-800 border border-red-200',
    };
    return colors[status?.toUpperCase()] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  // Utility functions for attachment handling
  const isImageFile = (fileType, fileName) => {
    if (!fileType && !fileName) return false;
    
    // Check by MIME type
    if (fileType && fileType.startsWith('image/')) {
      return true;
    }
    
    // Check by file extension
    if (fileName) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
      const extension = fileName.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    }
    
    return false;
  };

  const getFileTypeDisplay = (fileType, fileName) => {
    if (fileType) {
      return fileType.split('/')[1]?.toUpperCase() || 'FILE';
    }
    if (fileName) {
      return fileName.split('.').pop()?.toUpperCase() || 'FILE';
    }
    return 'FILE';
  };

  const getAttachmentColor = (index, isImage) => {
    if (isImage) {
      return 'from-gray-600 to-gray-700';
    }
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600'
    ];
    return colors[index % colors.length];
  };

  const handleImageClick = (imageUrl, fileName) => {
    setImagePreview({
      isOpen: true,
      imageUrl,
      fileName
    });
  };

  const closeImagePreview = () => {
    setImagePreview({ isOpen: false, imageUrl: '', fileName: '' });
  };

  // Mock attachments data - replace with actual API data
  const mockAttachments = [
    {
      id: 1,
      name: 'projector_manual.pdf',
      type: 'application/pdf',
      url: '/api/attachments/1'
    },
    {
      id: 2,
      name: 'broken_projector.jpg',
      type: 'image/jpeg',
      url: 'https://picsum.photos/seed/projector/400/300.jpg'
    },
    {
      id: 3,
      name: 'repair_request.doc',
      type: 'application/msword',
      url: '/api/attachments/3'
    },
    {
      id: 4,
      name: 'equipment_photo.png',
      type: 'image/png',
      url: 'https://picsum.photos/seed/equipment/400/300.jpg'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Ticket Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : ticketDetails ? (
            <div className="space-y-6">
              {/* Ticket ID and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="font-mono text-lg font-semibold text-gray-900">
                    {ticketDetails.ticketId}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(ticketDetails.priority)}`}>
                    {ticketDetails.priority}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ticketDetails.status)}`}>
                    {ticketDetails.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Title</label>
                </div>
                <p className="text-lg text-gray-900 font-medium">{ticketDetails.title}</p>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Description</label>
                </div>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {ticketDetails.description || 'No description provided'}
                </p>
              </div>

              {/* Category/Type */}
              {ticketDetails.category && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">Category / Type</label>
                  </div>
                  <p className="text-gray-900">{ticketDetails.category}</p>
                </div>
              )}

              {/* Related Resource */}
              {ticketDetails.relatedResource && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">Related Resource</label>
                  </div>
                  <p className="text-gray-900">{ticketDetails.relatedResource}</p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">Created Date</label>
                  </div>
                  <p className="text-gray-900">{formatDate(ticketDetails.createdDate)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">Updated Date</label>
                  </div>
                  <p className="text-gray-900">{formatDate(ticketDetails.updatedDate)}</p>
                </div>
              </div>

              {/* People */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">Requested User (Student)</label>
                  </div>
                  <p className="text-gray-900">{ticketDetails.submittedBy || 'Unknown'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-500">Assigned Technician</label>
                  </div>
                  <p className="text-gray-900">{ticketDetails.assignedTechnician || 'Unassigned'}</p>
                </div>
              </div>

              {/* Attachments */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Attachments</label>
                </div>
                {mockAttachments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No attachments available</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockAttachments.map((attachment, index) => {
                      const isImage = isImageFile(attachment.type, attachment.name);
                      const fileTypeDisplay = getFileTypeDisplay(attachment.type, attachment.name);
                      const colorClass = getAttachmentColor(index, isImage);
                      
                      return (
                        <div key={attachment.id} className="relative group cursor-pointer">
                          {isImage ? (
                            // Image attachment with preview
                            <div 
                              className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-90 transition-opacity"
                              onClick={() => handleImageClick(attachment.url, attachment.name)}
                            >
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              {/* Fallback for broken images */}
                              <div 
                                className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center"
                                style={{ display: 'none' }}
                              >
                                <div className="text-center">
                                  <Paperclip className="w-8 h-8 text-white mb-2 mx-auto" />
                                  <p className="text-xs text-white font-medium truncate px-2">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-gray-200">Preview not available</p>
                                </div>
                              </div>
                              
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Paperclip className="w-6 h-6 text-white mb-1 mx-auto" />
                                  <p className="text-xs text-white font-medium">Click to view</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Non-image attachment with existing design
                            <div className={`w-full h-32 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity`}>
                              <div className="text-center">
                                <Paperclip className="w-8 h-8 text-white mb-2 mx-auto" />
                                <p className="text-xs text-white font-medium truncate px-2">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-white opacity-80">{fileTypeDisplay}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* File name tooltip on hover for non-images */}
                          {!isImage && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="truncate">{attachment.name}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Unable to load ticket details</p>
            </div>
          )}

          {/* Modal footer */}
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
          
          {/* Image Preview Modal */}
          <ImagePreviewModal
            isOpen={imagePreview.isOpen}
            onClose={closeImagePreview}
            imageUrl={imagePreview.imageUrl}
            fileName={imagePreview.fileName}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;

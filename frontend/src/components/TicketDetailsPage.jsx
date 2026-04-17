import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Database, 
  Calendar, 
  Ticket, 
  Bell, 
  UserCircle, 
  Search, 
  Menu, 
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  Paperclip,
  MessageSquare,
  Send,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  X as XIcon,
  User,
  Wrench,
  AlertCircle
} from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [imagePreview, setImagePreview] = useState({ isOpen: false, imageUrl: '', fileName: '' });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);

  // Function to handle comments added from modal
  const handleCommentFromModal = (newComment) => {
    console.log('Adding comment from modal to Discussion & Updates:', newComment);
    // Add comment to the beginning of the list for real-time update
    setComments(prevComments => [newComment, ...prevComments]);
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Database, label: 'Resources', id: 'resources' },
    { icon: Calendar, label: 'Bookings', id: 'bookings' },
    { icon: Ticket, label: 'Tickets', id: 'tickets' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: UserCircle, label: 'Profile', id: 'profile' },
  ];

  useEffect(() => {
    const fetchCommentsForTicket = async () => {
      const apiUrl = `http://localhost:8080/api/comments/ticket/${id}`;
      console.log('Fetching comments from API URL:', apiUrl);
      console.log('Ticket ID:', id);
      
      try {
        const response = await fetch(apiUrl);
        console.log('API Response Status:', response.status);
        console.log('API Response Headers:', response.headers);
        
        if (response.ok) {
          const commentsData = await response.json();
          console.log('Comments loaded from API:', commentsData);
          setComments(commentsData);
        } else {
          // Fallback to mock data if API not available
          console.log('Comments API not available, status:', response.status);
          console.log('Response text:', await response.text());
          console.log('Using mock data instead');
          setComments([
            {
              id: 1,
              user: 'John Smith',
              role: 'Technician',
              message: 'I have diagnosed the issue. The projector bulb needs to be replaced.',
              timestamp: '2024-04-13 10:30 AM',
              edited: false
            },
            {
              id: 2,
              user: 'Sarah Johnson',
              role: 'Student',
              message: 'Thank you for the quick response. When can we expect this to be fixed?',
              timestamp: '2024-04-13 11:15 AM',
              edited: false
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        console.log('Network error detected, using mock data');
        // Fallback to mock data
        setComments([
          {
            id: 1,
            user: 'John Smith',
            role: 'Technician',
            message: 'I have diagnosed the issue. The projector bulb needs to be replaced.',
            timestamp: '2024-04-13 10:30 AM',
            edited: false
          },
          {
            id: 2,
            user: 'Sarah Johnson',
            role: 'Student',
            message: 'Thank you for the quick response. When can we expect this to be fixed?',
            timestamp: '2024-04-13 11:15 AM',
            edited: false
          }
        ]);
      }
    };

    const fetchTicketDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/dashboard/tickets/${id}`);
        if (response.ok) {
          const ticketData = await response.json();
          setTicket(ticketData);
          
          // Fetch comments for this ticket
          await fetchCommentsForTicket();
        } else {
          console.error('Failed to fetch ticket details');
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleMenuClick = (id) => {
    navigate(`/${id}`);
    setMobileOpen(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      user: 'Current User',
      role: 'Student',
      message: newComment.trim(),
      ticketId: parseInt(id)
    };

    try {
      // Try API first
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        const createdComment = await response.json();
        console.log('Comment created via API:', createdComment);
        // Add new comment to the beginning of the list for real-time update
        setComments(prevComments => [createdComment, ...prevComments]);
        setNewComment('');
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.log('API not available, using local update');
      // Fallback to local state update
      const localComment = {
        id: Date.now(), // Use timestamp as temporary ID
        user: 'Current User',
        role: 'Student',
        message: newComment.trim(),
        timestamp: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        ticketId: parseInt(id),
        edited: false
      };
      
      // Add new comment to the beginning of the list for real-time update
      setComments(prevComments => [localComment, ...prevComments]);
      setNewComment('');
      console.log('Comment created locally (demo mode)');
    }
  };

  // Edit and Delete handler functions
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedText(comment.message);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editedText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    setUpdatingCommentId(commentId);
    
    try {
      // API call to update comment
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: editedText,
          timestamp: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        })
      });

      if (response.ok) {
        const updatedComment = await response.json();
        console.log('Comment updated successfully via API:', updatedComment);
        
        // Update comment in local state with API response
        setComments(prevComments => prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                message: editedText, 
                timestamp: new Date().toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                edited: true 
              }
            : comment
        ));
        
        setEditingCommentId(null);
        setEditedText('');
      } else {
        // If API fails, fallback to local update for demo
        console.warn('API not available, using local update');
        throw new Error('API_NOT_AVAILABLE');
      }
      
    } catch (error) {
      console.error('Error updating comment:', error);
      
      // Fallback to local state update for demo purposes
      if (error.message === 'API_NOT_AVAILABLE' || error.message.includes('404')) {
        console.log('Using local fallback for comment update');
        
        // Update comment in local state immediately
        setComments(prevComments => prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                message: editedText, 
                timestamp: new Date().toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                edited: true 
              }
            : comment
        ));
        
        setEditingCommentId(null);
        setEditedText('');
        console.log('Comment updated locally (demo mode)');
      } else {
        alert('Failed to update comment. Please try again.');
      }
    } finally {
      setUpdatingCommentId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedText('');
  };

  const handleDeleteComment = (comment) => {
    setDeletingCommentId(comment.id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteComment = async () => {
    if (!deletingCommentId) return;

    try {
      // API call to delete comment
      const response = await fetch(`http://localhost:8080/api/comments/${deletingCommentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Comment deleted successfully via API:', result);

        // Remove comment from local state immediately
        setComments(prevComments => prevComments.filter(comment => comment.id !== deletingCommentId));
        setShowDeleteDialog(false);
        setDeletingCommentId(null);
      } else {
        // If API fails, fallback to local deletion for demo
        console.warn('API not available, using local deletion');
        throw new Error('API_NOT_AVAILABLE');
      }
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      
      // Fallback to local state deletion for demo purposes
      if (error.message === 'API_NOT_AVAILABLE' || error.message.includes('404')) {
        console.log('Using local fallback for comment deletion');
        
        // Remove comment from local state immediately
        setComments(prevComments => prevComments.filter(comment => comment.id !== deletingCommentId));
        setShowDeleteDialog(false);
        setDeletingCommentId(null);
        console.log('Comment deleted locally (demo mode)');
      } else {
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  const cancelDeleteComment = () => {
    setShowDeleteDialog(false);
    setDeletingCommentId(null);
  };

  // Check if user can edit/delete comment (mock logic - replace with real auth check)
  const canEditDeleteComment = (comment) => {
    // For demo purposes, allow editing/deleting all comments
    // In real app, check if comment.user === currentUser.user || user.hasAdminPrivileges
    return true;
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

  const getPriorityBadge = (priority) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-800 border border-red-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      LOW: 'bg-gray-100 text-gray-800 border border-gray-200',
      CRITICAL: 'bg-red-200 text-red-900 border border-red-300',
    };
    return colors[priority?.toUpperCase()] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const activityHistory = [
    {
      id: 1,
      type: 'created',
      title: 'Ticket Created',
      description: 'Ticket submitted by student',
      timestamp: '2024-04-13 09:00 AM',
      icon: AlertCircle,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'assigned',
      title: 'Technician Assigned',
      description: 'John Smith assigned to this ticket',
      timestamp: '2024-04-13 09:30 AM',
      icon: Wrench,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'status_change',
      title: 'Status Changed',
      description: 'Status changed to IN PROGRESS',
      timestamp: '2024-04-13 10:00 AM',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'update',
      title: 'Resolution Update',
      description: 'Parts ordered, awaiting delivery',
      timestamp: '2024-04-13 10:30 AM',
      icon: MessageSquare,
      color: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/tickets')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white shadow-lg border-r border-gray-200
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Smart Campus</h1>
                <p className="text-xs text-gray-500">Maintenance System</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1 rounded hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <button onClick={() => navigate('/tickets')} className="hover:text-gray-900">Tickets</button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Ticket Details</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Ticket Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ticket.status)}`}>
                          {ticket.status?.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Ticket ID</div>
                      <div className="font-mono text-sm font-semibold">{ticket.ticketId}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(ticket.createdDate).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Building A, Room 302</span>
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h2>
                  <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {ticket.description || 'No description provided'}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="text-gray-900">{ticket.submittedBy || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="text-gray-900">+1 234 567 8900</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-gray-900">student@campus.edu</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Assigned Technician</div>
                        <div className="text-gray-900">{ticket.assignedTechnician || 'Unassigned'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
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

                {/* Discussion & Updates */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Discussion & Updates</h2>
                  
                  {/* Comment Input */}
                  <div className="mb-6">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment or update..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleAddComment}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.user}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{comment.role}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            {comment.edited && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Edited</span>
                            )}
                          </div>
                          
                          {editingCommentId === comment.id ? (
                            // Edit mode
                            <div className="space-y-2">
                              <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                disabled={updatingCommentId === comment.id}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(comment.id)}
                                  disabled={updatingCommentId === comment.id || !editedText.trim()}
                                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {updatingCommentId === comment.id ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={updatingCommentId === comment.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <XIcon className="w-3 h-3" />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <div className="flex items-start gap-2">
                              <p className="flex-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{comment.message}</p>
                              {canEditDeleteComment(comment) && (
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => handleEditComment(comment)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 rounded transition-colors"
                                    title="Edit comment"
                                  >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 hover:border-red-300 rounded transition-colors"
                                    title="Delete comment"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity History Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h2>
                  <div className="space-y-4">
                    {activityHistory.map((activity, index) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}>
                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          {index < activityHistory.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-xs text-gray-600">{activity.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      
      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={imagePreview.isOpen}
        onClose={closeImagePreview}
        imageUrl={imagePreview.imageUrl}
        fileName={imagePreview.fileName}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={cancelDeleteComment}
            ></div>

            {/* Dialog panel */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Comment</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this comment?
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDeleteComment}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteComment}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;

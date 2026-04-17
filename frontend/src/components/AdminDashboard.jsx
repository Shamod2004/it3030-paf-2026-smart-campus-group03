import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import StatsCards from './StatsCards';
import ChartsSection from './ChartsSection';
import TicketTable from './TicketTable';
import AssignTicketModal from './AssignTicketModal';
import ViewTicketModal from './ViewTicketModal';
import ShareModal from './ShareModal';
import CreateTicketPage from './CreateTicketPage';
import AssignedTicketsPage from './AssignedTicketsPage';
import { verifyBackendConnection, apiCall } from '../utils/apiVerification';
import '../utils/corsTest'; // Load CORS test utility

const AdminDashboard = ({ onSwitchRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelLoading, setCancelLoading] = useState({});

  // Handle new ticket creation and ticket updates
  const handleNewTicket = (ticket) => {
    console.log('?? [STATE] handleNewTicket called - Ticket State Update');
    console.log('?? [STATE] Timestamp:', new Date().toISOString());
    console.log('?? [STATE] Ticket received:', ticket);
    console.log('?? [STATE] Current tickets count before update:', tickets.length);
    
    setTickets(prevTickets => {
      // Check if this is an existing ticket (has id) or a new ticket
      const existingTicket = prevTickets.find(t => t.id === ticket.id);
      
      let updatedTickets;
      if (existingTicket) {
        // This is an update - replace the existing ticket
        updatedTickets = prevTickets.map(t => 
          t.id === ticket.id ? ticket : t
        );
        console.log('?? [STATE] Updated existing ticket:', ticket.ticketId);
      } else {
        // This is a new ticket - add it to the list
        updatedTickets = [ticket, ...prevTickets];
        console.log('?? [STATE] Added new ticket:', ticket.ticketId);
      }
      
      console.log('?? [STATE] Updating tickets state:');
      console.log('  - Previous count:', prevTickets.length);
      console.log('  - New count:', updatedTickets.length);
      console.log('?? [STATE] Updated tickets list (first 5):', updatedTickets.slice(0, 5).map(t => t.ticketId));
      return updatedTickets;
    });
    
    // Verify state update
    setTimeout(() => {
      console.log('?? [STATE] State update verification - Current tickets count:', tickets.length);
    }, 100);
  };

  // Fetch tickets from backend
  const fetchTickets = async () => {
    console.log('?? [API CALL] Starting fetchTickets - Using API Verification Utility');
    console.log('?? [API] Timestamp:', new Date().toISOString());
    console.log('🚀 [API CALL] Starting fetchTickets - Using API Verification Utility');
    console.log('⏰ [API] Timestamp:', new Date().toISOString());
    
    try {
      setLoading(true);
      console.log('📡 [API] Calling apiCall utility for GET tickets...');
      
      const data = await apiCall('http://localhost:8080/api/dashboard/tickets', {
        method: 'GET'
      });
      
      console.log('� [API] Received data from apiCall utility');
      console.log('📏 [API] Response data length:', data?.length || 'N/A');
      
      // Sort tickets by ticketId in ascending order
      const sortedData = data.sort((a, b) => {
        // Extract numeric part from ticket ID (e.g., "INC-1042" -> 1042)
        const getNumericId = (ticketId) => {
          const match = ticketId.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };
        return getNumericId(a.ticketId) - getNumericId(b.ticketId);
      });
      
      console.log('🔄 [API] Sorted data by ticketId:', sortedData.map(t => t.ticketId));
      
      // State update
      console.log('🔄 [STATE] Updating React state with', sortedData.length, 'tickets');
      setTickets(sortedData);
      
      // Verify state update
      setTimeout(() => {
        console.log('✅ [STATE] State update verified - Current tickets count:', sortedData.length);
      }, 100);
      
      // Save to localStorage for persistence
      localStorage.setItem('tickets', JSON.stringify(sortedData));
      console.log('💾 [STORAGE] Tickets saved to localStorage');
      
    } catch (error) {
      console.error('💥 [API ERROR] Error in fetchTickets:', error);
      console.log('🔄 [FALLBACK] Attempting to load from localStorage due to API error...');
      
      // Try to load from localStorage as fallback
      const savedTickets = localStorage.getItem('tickets');
      if (savedTickets) {
        try {
          const parsedTickets = JSON.parse(savedTickets);
          setTickets(parsedTickets);
          console.log('✅ [FALLBACK] Loaded', parsedTickets.length, 'tickets from localStorage after API error');
        } catch (parseError) {
          console.error('❌ [FALLBACK] Error parsing localStorage data:', parseError);
        }
      } else {
        console.log('❌ [FALLBACK] No tickets found in localStorage after API error');
      }
    } finally {
      console.log('🏁 [API] fetchTickets completed');
      setLoading(false);
      console.log('🔄 [STATE] Loading state set to false');
    }
  };

  // Load tickets from localStorage on component mount
  useEffect(() => {
    console.log('🚀 [LIFECYCLE] AdminDashboard component mounted');
    console.log('⏰ [LIFECYCLE] Timestamp:', new Date().toISOString());
    
    // Verify backend connection first
    const verifyBackend = async () => {
      console.log('🔍 [BACKEND] Verifying backend connection...');
      try {
        await verifyBackendConnection();
        console.log('✅ [BACKEND] Backend verification completed');
      } catch (error) {
        console.error('❌ [BACKEND] Backend verification failed:', error);
      }
    };
    
    verifyBackend();
    
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      console.log('💾 [STORAGE] Found tickets in localStorage, loading...');
      try {
        const parsedTickets = JSON.parse(savedTickets);
        console.log('📊 [STORAGE] Loaded', parsedTickets.length, 'tickets from localStorage');
        console.log('🔄 [STATE] Setting initial state from localStorage');
        setTickets(parsedTickets);
        setLoading(false);
        console.log('🔄 [STATE] Loading state set to false (localStorage data)');
      } catch (error) {
        console.error('❌ [STORAGE] Error parsing saved tickets:', error);
      }
    } else {
      console.log('💾 [STORAGE] No tickets found in localStorage');
    }
    
    console.log('📡 [API] Triggering fetchTickets to get latest data from backend');
    fetchTickets(); // Still fetch from backend to get latest data
  }, []);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  // Filter tickets based on search term and maintain ascending order
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.ticketId?.toLowerCase().includes(searchLower) ||
      ticket.title?.toLowerCase().includes(searchLower) ||
      ticket.description?.toLowerCase().includes(searchLower) ||
      ticket.relatedResource?.toLowerCase().includes(searchLower) ||
      ticket.category?.toLowerCase().includes(searchLower) ||
      ticket.priority?.toLowerCase().includes(searchLower) ||
      ticket.status?.toLowerCase().includes(searchLower) ||
      ticket.submittedBy?.toLowerCase().includes(searchLower) ||
      ticket.assignedTechnician?.toLowerCase().includes(searchLower) ||
      ticket.createdDate?.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    // Maintain ascending order by ticketId even after filtering
    const getNumericId = (ticketId) => {
      const match = ticketId.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };
    return getNumericId(a.ticketId) - getNumericId(b.ticketId);
  });

  const handleViewTicket = (ticketId) => {
    console.log('View ticket:', ticketId);
    // Find the ticket data from the tickets state
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setViewModalOpen(true);
    }
  };

  const handleAssignTicket = (ticketId) => {
    console.log('Assign ticket:', ticketId);
    // Find the ticket data from the tickets state
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setAssignModalOpen(true);
    }
  };

  const handleAssignModalClose = () => {
    setAssignModalOpen(false);
    setSelectedTicket(null);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedTicket(null);
  };

  const handleTicketAssign = async (assignmentData) => {
    console.log('Ticket assigned:', assignmentData);
    
    try {
      // Make real API call to update assigned technician
      const response = await fetch(`http://localhost:8080/api/dashboard/tickets/${assignmentData.ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTechnician: assignmentData.technicianName || 'Unassigned'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to assign technician');
      }

      const updatedTicket = await response.json();
      
      // Update the ticket in state and maintain sorting order
      setTickets(prevTickets => {
        const updatedTickets = prevTickets.map(ticket => 
          ticket.id === assignmentData.ticketId 
            ? updatedTicket
            : ticket
        );
        
        // Re-sort to maintain ascending order by ticketId
        return updatedTickets.sort((a, b) => {
          const getNumericId = (ticketId) => {
            const match = ticketId.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          return getNumericId(a.ticketId) - getNumericId(b.ticketId);
        });
      });
      
      setSuccessMessage(`Technician assigned successfully: ${assignmentData.technicianName}`);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Close the modal
      handleAssignModalClose();
    } catch (error) {
      console.error('Error assigning technician:', error);
      setSuccessMessage('Failed to assign technician. Please try again.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleShareTicket = (ticketId) => {
    // Find the ticket data
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      console.error('Ticket not found:', ticketId);
      return;
    }

    // Set selected ticket and open share modal
    setSelectedTicket(ticket);
    setShareModalOpen(true);
  };

  const handleCopyTicketDetails = () => {
    if (!selectedTicket) {
      console.error('No selected ticket for copying details');
      return;
    }

    console.log('?? [COPY] Copying ticket details for:', selectedTicket.ticketId);

    // Format ticket details for sharing
    const ticketDetails = `Ticket ID: ${selectedTicket.ticketId}
Title: ${selectedTicket.title}
Category: ${selectedTicket.category}
Priority: ${selectedTicket.priority}
Status: ${selectedTicket.status}
Submitted By: ${selectedTicket.submittedBy}
Assigned Technician: ${selectedTicket.assignedTechnician || 'Unassigned'}
Created Date: ${selectedTicket.createdDate}

View ticket: ${window.location.origin}/tickets/${selectedTicket.ticketId}`;

    console.log('?? [COPY] Ticket details formatted:', ticketDetails.substring(0, 100) + '...');

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ticketDetails).then(() => {
        console.log('?? [COPY] Successfully copied using clipboard API');
        setSuccessMessage('Ticket details copied to clipboard!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }).catch(err => {
        console.error('?? [COPY] Clipboard API failed, trying fallback:', err);
        copyToClipboardFallback(ticketDetails);
      });
    } else {
      console.log('?? [COPY] Clipboard API not available, using fallback');
      copyToClipboardFallback(ticketDetails);
    }
  };

  // Fallback copy method
  const copyToClipboardFallback = (text, type = 'details') => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        console.log('?? [COPY] Successfully copied using fallback method');
        const message = type === 'link' ? 'Ticket link copied to clipboard!' : 'Ticket details copied to clipboard!';
        setSuccessMessage(message);
      } else {
        console.error('?? [COPY] Fallback copy command failed');
        const message = type === 'link' ? 'Failed to copy ticket link' : 'Failed to copy ticket details';
        setSuccessMessage(message);
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('?? [COPY] Fallback method failed:', err);
      const message = type === 'link' ? 'Failed to copy ticket link' : 'Failed to copy ticket details';
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCopyLink = () => {
    if (!selectedTicket) {
      console.error('No selected ticket for copying link');
      return;
    }

    const shareLink = `${window.location.origin}/tickets/${selectedTicket.ticketId}`;
    console.log('?? [COPY] Copying ticket link:', shareLink);

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareLink).then(() => {
        console.log('?? [COPY] Successfully copied link using clipboard API');
        setSuccessMessage('Ticket link copied to clipboard!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }).catch(err => {
        console.error('?? [COPY] Clipboard API failed for link, trying fallback:', err);
        copyToClipboardFallback(shareLink, 'link');
      });
    } else {
      console.log('?? [COPY] Clipboard API not available for link, using fallback');
      copyToClipboardFallback(shareLink, 'link');
    }
  };

  const handleNativeShare = () => {
    if (!selectedTicket) return;

    if (navigator.share) {
      navigator.share({
        title: `Ticket ${selectedTicket.ticketId} - ${selectedTicket.title}`,
        text: `Status: ${selectedTicket.status}, Priority: ${selectedTicket.priority}`,
        url: `${window.location.origin}/tickets/${selectedTicket.ticketId}`
      }).then(() => {
        setSuccessMessage('Ticket shared successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }).catch(err => {
        console.error('Native share failed:', err);
        // Fallback to copy details
        handleCopyTicketDetails();
      });
    } else {
      // Fallback to copy details if native share not supported
      handleCopyTicketDetails();
    }
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCancelTicket = async (ticketId) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this ticket permanently?');
    if (!confirmed) return;
    
    // Set loading state for this specific ticket
    setCancelLoading(prev => ({ ...prev, [ticketId]: true }));
    
    try {
      console.log('?? [DELETE] Starting ticket deletion for ID:', ticketId);
      
      // Make actual DELETE API call
      const response = await fetch(`/api/dashboard/tickets/${ticketId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Ticket not found');
        }
        throw new Error('Delete failed');
      }
      
      const result = await response.json();
      console.log('?? [DELETE] API response:', result);

      // Remove the deleted ticket from state immediately
      setTickets(prevTickets => {
        const remainingTickets = prevTickets.filter(ticket => ticket.id !== ticketId);
        
        console.log('?? [DELETE] Ticket removed from UI state');
        console.log('?? [DELETE] Remaining tickets count:', remainingTickets.length);
        console.log('?? [DELETE] Removed ticket ID:', ticketId);
        
        return remainingTickets;
      });
      
      // Show success message
      setSuccessMessage('Ticket deleted successfully');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      console.log('?? [DELETE] Ticket deletion completed successfully');
      
    } catch (error) {
      console.error('?? [DELETE] Error deleting ticket:', error.message);
      setSuccessMessage('Failed to delete ticket: ' + error.message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } finally {
      // Remove loading state
      setCancelLoading(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleMenuClick = (itemId) => {
    setActiveMenuItem(itemId);
    // Close mobile sidebar after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <>
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}

            {/* Stats Cards */}
            <StatsCards tickets={tickets} loading={loading} />
            
            {/* Charts Section */}
            <ChartsSection tickets={tickets} loading={loading} />
            
            {/* Recent Tickets Table */}
            <div className="mt-8">
              <TicketTable 
                tickets={filteredTickets}
                loading={loading}
                cancelLoading={cancelLoading}
                onView={handleViewTicket}
                onAssign={handleAssignTicket}
                onCancel={handleCancelTicket}
                onShare={handleShareTicket}
              />
            </div>
          </>
        );
      
      case 'resources':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Resources</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600">Resources management coming soon...</p>
            </div>
          </div>
        );
      
      case 'bookings':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bookings</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600">Bookings management coming soon...</p>
            </div>
          </div>
        );
      
      case 'tickets':
        return <AssignedTicketsPage />;
      
      case 'create-ticket':
        return <CreateTicketPage onNavigate={setActiveMenuItem} onNewTicket={handleNewTicket} />;
      
      case 'notifications':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600">Notifications center coming soon...</p>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600">User profile management coming soon...</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600">The requested page could not be found.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeMenuItem}
        onMenuClick={handleMenuClick}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        onSwitchRole={onSwitchRole}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Smart Campus</h1>
        </div>
        
        {/* Desktop Top Navbar */}
        <div className="hidden lg:block">
          <TopNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Assign Ticket Modal */}
      <AssignTicketModal
        isOpen={assignModalOpen}
        onClose={handleAssignModalClose}
        ticket={selectedTicket}
        onAssign={handleTicketAssign}
      />

      {/* View Ticket Modal */}
      <ViewTicketModal
        isOpen={viewModalOpen}
        onClose={handleViewModalClose}
        ticket={selectedTicket}
      />

      {/* Share Ticket Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={handleShareModalClose}
        ticket={selectedTicket}
        onCopyDetails={handleCopyTicketDetails}
        onCopyLink={handleCopyLink}
        onNativeShare={handleNativeShare}
      />
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TicketFormPanelStandalone from './TicketFormPanelStandalone';
import './TicketPage.css';

const CreateTicketPage = ({ onNavigate, onNewTicket }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const handleTicketCreated = (newTicket) => {
    setSuccessMessage('Ticket created successfully!');
    
    // Call global new ticket handler to update state across all components
    if (onNewTicket) {
      onNewTicket(newTicket);
    }
    
    // Store new ticket in localStorage for persistence
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    existingTickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(existingTickets));
    
    // Navigate back to tickets page after a short delay
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('tickets');
      }
    }, 1500);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('tickets');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Tickets
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
              <p className="text-gray-600 mt-1">Fill in the details below to create a new support ticket</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-green-800 font-medium">{successMessage}</div>
            </div>
          </div>
        )}

        {/* Ticket Form */}
        <TicketFormPanelStandalone 
          onTicketCreated={handleTicketCreated}
          onClose={handleBack}
        />
      </div>
    </div>
  );
};

export default CreateTicketPage;

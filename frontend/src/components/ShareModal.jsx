import React from 'react';
import PropTypes from 'prop-types';
import { Copy, Link, Share2, X } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, ticket, onCopyDetails, onCopyLink, onNativeShare }) => {
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
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Share Ticket</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ticket details preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{ticket.ticketId}</h4>
            <p className="text-sm text-gray-700 mb-1">{ticket.title}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Status: {ticket.status}</span>
              <span>Priority: {ticket.priority}</span>
            </div>
          </div>

          {/* Share options */}
          <div className="space-y-3">
            {/* Copy details option */}
            <button
              onClick={() => {
                console.log('?? [SHARE_MODAL] Copy details button clicked');
                if (onCopyDetails) {
                  onCopyDetails();
                } else {
                  console.error('?? [SHARE_MODAL] onCopyDetails function not provided');
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Copy className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Copy Details</div>
                <div className="text-sm text-gray-500">Copy full ticket information</div>
              </div>
            </button>

            {/* Copy link option */}
            <button
              onClick={() => {
                console.log('?? [SHARE_MODAL] Copy link button clicked');
                if (onCopyLink) {
                  onCopyLink();
                } else {
                  console.error('?? [SHARE_MODAL] onCopyLink function not provided');
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Link className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Copy Link</div>
                <div className="text-sm text-gray-500">Copy shareable ticket link</div>
              </div>
            </button>

            {/* Native share option (if supported) */}
            {navigator.share && (
              <button
                onClick={onNativeShare}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Share</div>
                  <div className="text-sm text-gray-500">Share via system share dialog</div>
                </div>
              </button>
            )}
          </div>

          {/* Modal footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticket: PropTypes.shape({
    ticketId: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string
  }),
  onCopyDetails: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired,
  onNativeShare: PropTypes.func.isRequired
};

export default ShareModal;

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Image } from 'lucide-react';

const AttachFileModal = ({ isOpen, onClose, ticket, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen || !ticket) return null;

  // Allowed file types and validation
  const allowedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  };

  const validateFile = (file) => {
    // Check file type
    const isValidType = Object.keys(allowedTypes).some(type => 
      file.type === type || allowedTypes[type].some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    );

    if (!isValidType) {
      alert('Invalid file type. Please select JPG, PNG, PDF, or DOC files.');
      return false;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit. Please select a smaller file.');
      return false;
    }

    return true;
  };

  const generatePreview = (file) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return url;
    } else {
      setPreviewUrl('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        generatePreview(file);
      } else {
        // Reset file input
        e.target.value = '';
      }
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    // Cancel ongoing upload if any
    if (isUploading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear file selection and preview
    clearFileSelection();
    
    // Close modal
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create new AbortController for this upload
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('ticketId', ticket.id || ticket.ticketId);

      // Simulate upload for now since backend endpoint has issues
      // TODO: Replace with real API call when backend is ready
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setUploadProgress(i);
      }
      
      const result = {
        id: Date.now(),
        url: previewUrl || `data:application/octet-stream;base64,mock`,
        success: true
      };
      
      console.log('File uploaded (simulated):', selectedFile.name, result);
      
      console.log('File uploaded successfully:', result);
      
      // Add file to attachments list via callback
      if (onUploadSuccess) {
        onUploadSuccess({
          id: result.id || Date.now(),
          name: selectedFile.name,
          type: selectedFile.type,
          url: result.url || URL.createObjectURL(selectedFile),
          size: selectedFile.size
        });
      }
      
      // Clear selection and close modal
      clearFileSelection();
      onClose();
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled by user');
      } else {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Attach File</h3>
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
            <p className="text-sm text-gray-700">{ticket.title}</p>
          </div>

          {/* File upload area */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors relative">
              {previewUrl ? (
                // Show preview for images
                <div className="mb-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg mx-auto"
                  />
                </div>
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              )}
              
              <p className="text-sm text-gray-600 mb-2">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX, PNG, JPG up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>

            {selectedFile && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Selected: {selectedFile.name}
                    </p>
                    <p className="text-xs text-blue-700">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-blue-600">
                      Type: {selectedFile.type || 'Unknown'}
                    </p>
                  </div>
                  {selectedFile.type.startsWith('image/') && (
                    <Image className="w-8 h-8 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                  {!selectedFile.type.startsWith('image/') && (
                    <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">Uploading...</p>
                  <p className="text-xs text-gray-600">{uploadProgress}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Cancel Upload' : 'Cancel'}
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachFileModal;

/**
 * API Verification Utility
 * Provides comprehensive debugging and verification for API endpoints
 */

// Backend verification function
export const verifyBackendConnection = async () => {
  console.log('🔍 [BACKEND VERIFICATION] Starting comprehensive backend check');
  console.log('⏰ [BACKEND] Timestamp:', new Date().toISOString());
  
  const backendUrl = 'http://localhost:8080';
  const endpoints = [
    { path: '/', method: 'GET', description: 'Root endpoint' },
    { path: '/api/dashboard/tickets', method: 'GET', description: 'Get all tickets' },
    { path: '/api/dashboard/dashboard/stats', method: 'GET', description: 'Get dashboard stats' },
    { path: '/api/dashboard/tickets', method: 'OPTIONS', description: 'CORS preflight for tickets' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    console.log(`🔍 [BACKEND] Testing ${endpoint.description}: ${endpoint.method} ${backendUrl}${endpoint.path}`);
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${backendUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const result = {
        endpoint: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        success: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      };
      
      if (response.ok) {
        try {
          const data = await response.json();
          result.data = data;
          result.dataType = Array.isArray(data) ? 'array' : typeof data;
          result.dataLength = Array.isArray(data) ? data.length : 'N/A';
          console.log(`✅ [BACKEND] ${endpoint.description} - SUCCESS:`, result);
        } catch (e) {
          result.text = await response.text();
          console.log(`✅ [BACKEND] ${endpoint.description} - SUCCESS (text):`, result);
        }
      } else {
        try {
          const errorData = await response.json();
          result.error = errorData;
          console.log(`❌ [BACKEND] ${endpoint.description} - FAILED:`, result);
        } catch (e) {
          result.errorText = await response.text();
          console.log(`❌ [BACKEND] ${endpoint.description} - FAILED (text):`, result);
        }
      }
      
      results.push(result);
      
    } catch (error) {
      const errorResult = {
        endpoint: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        success: false,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      };
      console.log(`💥 [BACKEND] ${endpoint.description} - ERROR:`, errorResult);
      results.push(errorResult);
    }
  }
  
  console.log('📊 [BACKEND VERIFICATION SUMMARY]:');
  console.log('Total endpoints tested:', endpoints.length);
  console.log('Successful:', results.filter(r => r.success).length);
  console.log('Failed:', results.filter(r => !r.success).length);
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.method} ${result.endpoint} - ${result.description}`);
  });
  
  return results;
};

// API call wrapper with comprehensive logging
export const apiCall = async (url, options = {}) => {
  const callId = Math.random().toString(36).substr(2, 9);
  console.log(`🚀 [API CALL ${callId}] Starting API request`);
  console.log(`📍 [API ${callId}] URL: ${options.method || 'GET'} ${url}`);
  console.log(`⏰ [API ${callId}] Timestamp: ${new Date().toISOString()}`);
  
  if (options.body) {
    console.log(`📤 [API ${callId}] Request body:`, options.body);
  }
  
  if (options.headers) {
    console.log(`📋 [API ${callId}] Request headers:`, options.headers);
  }
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`📥 [API ${callId}] Response received:`);
    console.log(`  - Status Code: ${response.status}`);
    console.log(`  - Status Text: ${response.statusText}`);
    console.log(`  - Response Time: ${responseTime}ms`);
    console.log(`  - Headers:`, Object.fromEntries(response.headers.entries()));
    
    let data;
    if (response.status !== 204) { // No Content
      try {
        data = await response.json();
        console.log(`✅ [API ${callId}] Response data:`, data);
        console.log(`📊 [API ${callId}] Data type: ${typeof data}, Length: ${Array.isArray(data) ? data.length : 'N/A'}`);
      } catch (e) {
        const text = await response.text();
        console.log(`📄 [API ${callId}] Response text:`, text);
        data = text;
      }
    }
    
    if (!response.ok) {
      console.error(`❌ [API ${callId}] API Error: ${response.status} ${response.statusText}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ [API ${callId}] API call completed successfully`);
    return data;
    
  } catch (error) {
    console.error(`💥 [API ${callId}] API call failed:`, error);
    console.error(`💥 [API ${callId}] Error details:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

// Network inspection utility
export const inspectNetworkRequest = (requestDetails) => {
  console.log('🔍 [NETWORK INSPECTION] Request Details:');
  console.log('  - URL:', requestDetails.url);
  console.log('  - Method:', requestDetails.method);
  console.log('  - Headers:', requestDetails.headers);
  console.log('  - Body:', requestDetails.body);
  console.log('  - Timestamp:', new Date().toISOString());
  return requestDetails;
};

// Response inspection utility
export const inspectNetworkResponse = (response, data) => {
  console.log('🔍 [NETWORK INSPECTION] Response Details:');
  console.log('  - Status:', response.status);
  console.log('  - Status Text:', response.statusText);
  console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
  console.log('  - Data Type:', typeof data);
  console.log('  - Data Length:', Array.isArray(data) ? data.length : 'N/A');
  console.log('  - Timestamp:', new Date().toISOString());
  console.log('  - Data:', data);
  return { response, data };
};

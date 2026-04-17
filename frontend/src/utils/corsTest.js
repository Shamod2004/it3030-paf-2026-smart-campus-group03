/**
 * CORS Testing Utility
 * Tests CORS configuration for all endpoints
 */

export const testCORS = async () => {
  console.log('🔍 [CORS TEST] Starting CORS configuration testing');
  console.log('⏰ [CORS TEST] Timestamp:', new Date().toISOString());
  
  const testOrigin = 'http://127.0.0.1:55747';
  const backendUrl = 'http://localhost:8080';
  
  const endpoints = [
    { path: '/', method: 'GET', description: 'Root endpoint' },
    { path: '/api/dashboard/tickets', method: 'GET', description: 'Get all tickets' },
    { path: '/api/dashboard/tickets', method: 'POST', description: 'Create ticket' },
    { path: '/api/dashboard/tickets/1', method: 'PUT', description: 'Update ticket' },
    { path: '/api/dashboard/tickets/1', method: 'DELETE', description: 'Delete ticket' },
    { path: '/api/dashboard/dashboard/stats', method: 'GET', description: 'Get dashboard stats' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    console.log(`🔍 [CORS TEST] Testing ${endpoint.description}: ${endpoint.method} ${endpoint.path}`);
    
    try {
      // Test preflight request (OPTIONS)
      console.log(`📡 [CORS TEST] Sending OPTIONS preflight request...`);
      const preflightResponse = await fetch(`${backendUrl}${endpoint.path}`, {
        method: 'OPTIONS',
        headers: {
          'Origin': testOrigin,
          'Access-Control-Request-Method': endpoint.method,
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      console.log(`📥 [CORS TEST] Preflight response:`);
      console.log(`  - Status: ${preflightResponse.status}`);
      console.log(`  - Access-Control-Allow-Origin: ${preflightResponse.headers.get('Access-Control-Allow-Origin')}`);
      console.log(`  - Access-Control-Allow-Methods: ${preflightResponse.headers.get('Access-Control-Allow-Methods')}`);
      console.log(`  - Access-Control-Allow-Headers: ${preflightResponse.headers.get('Access-Control-Allow-Headers')}`);
      
      const preflightSuccess = preflightResponse.status === 204 || preflightResponse.status === 200;
      
      if (preflightSuccess) {
        console.log(`✅ [CORS TEST] Preflight request PASSED for ${endpoint.description}`);
        
        // Test actual request
        console.log(`📡 [CORS TEST] Sending actual ${endpoint.method} request...`);
        const actualResponse = await fetch(`${backendUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Origin': testOrigin,
            'Content-Type': 'application/json'
          },
          body: (endpoint.method === 'POST' || endpoint.method === 'PUT') ? JSON.stringify({ test: 'data' }) : undefined
        });
        
        console.log(`📥 [CORS TEST] Actual response:`);
        console.log(`  - Status: ${actualResponse.status}`);
        console.log(`  - Access-Control-Allow-Origin: ${actualResponse.headers.get('Access-Control-Allow-Origin')}`);
        
        const actualSuccess = actualResponse.ok;
        
        results.push({
          endpoint: endpoint.path,
          method: endpoint.method,
          description: endpoint.description,
          preflightSuccess,
          actualSuccess,
          overallSuccess: preflightSuccess && actualSuccess,
          preflightStatus: preflightResponse.status,
          actualStatus: actualResponse.status,
          corsHeaders: {
            preflight: {
              'Access-Control-Allow-Origin': preflightResponse.headers.get('Access-Control-Allow-Origin'),
              'Access-Control-Allow-Methods': preflightResponse.headers.get('Access-Control-Allow-Methods'),
              'Access-Control-Allow-Headers': preflightResponse.headers.get('Access-Control-Allow-Headers')
            },
            actual: {
              'Access-Control-Allow-Origin': actualResponse.headers.get('Access-Control-Allow-Origin')
            }
          }
        });
        
        if (actualSuccess) {
          console.log(`✅ [CORS TEST] Actual request PASSED for ${endpoint.description}`);
        } else {
          console.log(`❌ [CORS TEST] Actual request FAILED for ${endpoint.description}`);
        }
        
      } else {
        console.log(`❌ [CORS TEST] Preflight request FAILED for ${endpoint.description}`);
        results.push({
          endpoint: endpoint.path,
          method: endpoint.method,
          description: endpoint.description,
          preflightSuccess: false,
          actualSuccess: false,
          overallSuccess: false,
          preflightStatus: preflightResponse.status,
          error: 'Preflight request failed'
        });
      }
      
    } catch (error) {
      console.error(`💥 [CORS TEST] Error testing ${endpoint.description}:`, error);
      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        preflightSuccess: false,
        actualSuccess: false,
        overallSuccess: false,
        error: error.message
      });
    }
  }
  
  // Summary
  console.log('\n📊 [CORS TEST SUMMARY]');
  console.log('='.repeat(50));
  console.log(`Total endpoints tested: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.overallSuccess).length}`);
  console.log(`Failed: ${results.filter(r => !r.overallSuccess).length}`);
  console.log(`Success Rate: ${((results.filter(r => r.overallSuccess).length / results.length) * 100).toFixed(1)}%`);
  
  console.log('\n📋 [DETAILED RESULTS]');
  results.forEach(result => {
    const status = result.overallSuccess ? '✅' : '❌';
    console.log(`${status} ${result.method} ${result.endpoint} - ${result.description}`);
    if (!result.overallSuccess) {
      console.log(`   Error: ${result.error || 'Request failed'}`);
      if (result.preflightStatus) {
        console.log(`   Preflight Status: ${result.preflightStatus}`);
      }
      if (result.actualStatus) {
        console.log(`   Actual Status: ${result.actualStatus}`);
      }
    }
  });
  
  return results;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testCORS = testCORS;
  console.log('🔍 [CORS TEST] CORS test utility loaded. Use testCORS() in console');
}

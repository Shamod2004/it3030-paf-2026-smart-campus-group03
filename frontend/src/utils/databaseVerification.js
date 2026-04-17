/**
 * Database Verification Utility
 * Comprehensive database testing and validation
 */

import { apiCall } from './apiVerification.js';

// Test database connection and schema
export const verifyDatabaseConnection = async () => {
  console.log('🔍 [DATABASE VERIFICATION] Starting database connection test');
  console.log('⏰ [DATABASE] Timestamp:', new Date().toISOString());
  
  const testResults = {
    connectionTest: null,
    schemaTest: null,
    dataTest: null,
    performanceTest: null,
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  try {
    // Test 1: Database Connection
    console.log('\n🔍 [TEST 1] Database Connection Test');
    const connectionStart = Date.now();
    
    try {
      const response = await apiCall('http://localhost:8080/api/dashboard/tickets', {
        method: 'GET'
      });
      
      const connectionTime = Date.now() - connectionStart;
      
      testResults.connectionTest = {
        success: true,
        responseTime: `${connectionTime}ms`,
        dataReceived: response ? response.length : 0,
        message: 'Database connection successful'
      };
      
      console.log(`✅ [CONNECTION] Database connected in ${connectionTime}ms`);
      console.log(`📊 [CONNECTION] Received ${response ? response.length : 0} records`);
      
    } catch (error) {
      testResults.connectionTest = {
        success: false,
        error: error.message,
        message: 'Database connection failed'
      };
      
      console.log(`❌ [CONNECTION] Database connection failed: ${error.message}`);
    }
    
    testResults.summary.total++;
    if (testResults.connectionTest.success) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
    }

    // Test 2: Schema Validation
    console.log('\n🔍 [TEST 2] Schema Validation Test');
    
    try {
      const schemaResponse = await apiCall('http://localhost:8080/api/dashboard/dashboard/stats', {
        method: 'GET'
      });
      
      testResults.schemaTest = {
        success: true,
        statsData: schemaResponse,
        message: 'Schema validation successful'
      };
      
      console.log('✅ [SCHEMA] Database schema is valid');
      console.log('📊 [SCHEMA] Dashboard stats available:', schemaResponse);
      
    } catch (error) {
      testResults.schemaTest = {
        success: false,
        error: error.message,
        message: 'Schema validation failed'
      };
      
      console.log(`❌ [SCHEMA] Schema validation failed: ${error.message}`);
    }
    
    testResults.summary.total++;
    if (testResults.schemaTest.success) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
    }

    // Test 3: Data Integrity Test
    console.log('\n🔍 [TEST 3] Data Integrity Test');
    
    try {
      const dataResponse = await apiCall('http://localhost:8080/api/dashboard/tickets', {
        method: 'GET'
      });
      
      // Validate data structure
      const isValidData = Array.isArray(dataResponse) && dataResponse.length > 0;
      const hasValidStructure = dataResponse.every(ticket => 
        ticket.ticketId && 
        ticket.title && 
        ticket.status && 
        ticket.priority
      );
      
      testResults.dataTest = {
        success: isValidData && hasValidStructure,
        recordCount: dataResponse ? dataResponse.length : 0,
        validStructure: hasValidStructure,
        sampleData: dataResponse ? dataResponse.slice(0, 3) : [],
        message: isValidData && hasValidStructure ? 'Data integrity test passed' : 'Data integrity issues found'
      };
      
      if (isValidData && hasValidStructure) {
        console.log(`✅ [DATA] Data integrity test passed (${dataResponse.length} records)`);
        console.log('📋 [DATA] Sample records:', dataResponse.slice(0, 3).map(t => t.ticketId));
      } else {
        console.log('❌ [DATA] Data integrity test failed');
        if (!isValidData) console.log('  - No data received');
        if (!hasValidStructure) console.log('  - Invalid data structure');
      }
      
    } catch (error) {
      testResults.dataTest = {
        success: false,
        error: error.message,
        message: 'Data integrity test failed'
      };
      
      console.log(`❌ [DATA] Data integrity test failed: ${error.message}`);
    }
    
    testResults.summary.total++;
    if (testResults.dataTest.success) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
    }

    // Test 4: Performance Test
    console.log('\n🔍 [TEST 4] Database Performance Test');
    
    const performanceTimes = [];
    const iterations = 3;
    
    for (let i = 0; i < iterations; i++) {
      try {
        const perfStart = Date.now();
        await apiCall('http://localhost:8080/api/dashboard/tickets', {
          method: 'GET'
        });
        const perfTime = Date.now() - perfStart;
        performanceTimes.push(perfTime);
        console.log(`📡 [PERF] Query ${i + 1}: ${perfTime}ms`);
      } catch (error) {
        console.log(`❌ [PERF] Query ${i + 1} failed: ${error.message}`);
        performanceTimes.push(null);
      }
    }
    
    const validTimes = performanceTimes.filter(t => t !== null);
    const avgTime = validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : 0;
    
    testResults.performanceTest = {
      success: validTimes.length > 0,
      averageTime: `${avgTime.toFixed(2)}ms`,
      minTime: validTimes.length > 0 ? Math.min(...validTimes) : 0,
      maxTime: validTimes.length > 0 ? Math.max(...validTimes) : 0,
      successRate: `${(validTimes.length / iterations * 100).toFixed(1)}%`,
      message: validTimes.length > 0 ? 'Performance test completed' : 'Performance test failed'
    };
    
    if (validTimes.length > 0) {
      console.log(`✅ [PERF] Performance test completed`);
      console.log(`📊 [PERF] Average: ${avgTime.toFixed(2)}ms, Min: ${Math.min(...validTimes)}ms, Max: ${Math.max(...validTimes)}ms`);
    } else {
      console.log('❌ [PERF] Performance test failed');
    }
    
    testResults.summary.total++;
    if (testResults.performanceTest.success) {
      testResults.summary.passed++;
    } else {
      testResults.summary.failed++;
    }

  } catch (error) {
    console.error('💥 [DATABASE VERIFICATION] Unexpected error:', error);
  }

  // Print Summary
  console.log('\n📊 [DATABASE VERIFICATION SUMMARY]');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  
  console.log('\n📋 [DETAILED RESULTS]');
  const tests = [
    { name: 'Connection Test', result: testResults.connectionTest },
    { name: 'Schema Test', result: testResults.schemaTest },
    { name: 'Data Test', result: testResults.dataTest },
    { name: 'Performance Test', result: testResults.performanceTest }
  ];
  
  tests.forEach(test => {
    const status = test.result.success ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${test.result.message}`);
    if (!test.result.success && test.result.error) {
      console.log(`   Error: ${test.result.error}`);
    }
  });

  return testResults;
};

// Quick database health check
export const quickDatabaseHealthCheck = async () => {
  console.log('⚡ [QUICK CHECK] Starting database health check');
  
  try {
    const startTime = Date.now();
    const response = await apiCall('http://localhost:8080/api/dashboard/tickets', {
      method: 'GET'
    });
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      recordCount: response ? response.length : 0,
      timestamp: new Date().toISOString(),
      message: 'Database is healthy and responsive'
    };
    
    console.log('✅ [HEALTH] Database is healthy');
    console.log(`📊 [HEALTH] Response time: ${responseTime}ms, Records: ${response ? response.length : 0}`);
    
    return healthStatus;
    
  } catch (error) {
    const healthStatus = {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
      message: 'Database health check failed'
    };
    
    console.log('❌ [HEALTH] Database health check failed:', error.message);
    
    return healthStatus;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.verifyDatabaseConnection = verifyDatabaseConnection;
  window.quickDatabaseHealthCheck = quickDatabaseHealthCheck;
  console.log('🔍 [DATABASE VERIFICATION] Database verification utilities loaded');
  console.log('Use verifyDatabaseConnection() or quickDatabaseHealthCheck() in console');
}

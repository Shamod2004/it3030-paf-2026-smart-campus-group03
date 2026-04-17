/**
 * API Test Suite
 * Comprehensive testing for all API endpoints with verification
 */

import { apiCall, verifyBackendConnection } from './apiVerification.js';

// Test data for creating/updating tickets
const testTicket = {
  ticketId: `INC-TEST-${Date.now()}`,
  title: 'Test Ticket for API Verification',
  description: 'This is a test ticket created by the API test suite',
  relatedResource: 'Classroom',
  priority: 'MEDIUM',
  issueType: 'Electrical',
  category: 'Electrical',
  location: 'Room 101',
  contactName: 'Test User',
  contactNumber: '1234567890',
  contactEmail: 'test@example.com',
  attachments: [],
  status: 'Open',
  submittedBy: 'Test User',
  assignedTechnician: 'Not assigned',
  createdDate: new Date().toISOString().split('T')[0],
  updatedDate: new Date().toISOString().split('T')[0]
};

// API Test Suite
export const runAPITestSuite = async () => {
  console.log('🧪 [API TEST SUITE] Starting comprehensive API testing');
  console.log('⏰ [TEST SUITE] Timestamp:', new Date().toISOString());
  
  const testResults = {
    backendVerification: null,
    getTickets: null,
    createTicket: null,
    getTicketById: null,
    updateTicket: null,
    deleteTicket: null,
    getDashboardStats: null,
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  try {
    // 1. Backend Connection Verification
    console.log('\n🔍 [TEST 1] Backend Connection Verification');
    testResults.backendVerification = await verifyBackendConnection();
    testResults.summary.total++;
    if (testResults.backendVerification.every(r => r.success)) {
      testResults.summary.passed++;
      console.log('✅ [TEST 1] Backend verification PASSED');
    } else {
      testResults.summary.failed++;
      console.log('❌ [TEST 1] Backend verification FAILED');
    }

    // 2. GET All Tickets
    console.log('\n🔍 [TEST 2] GET All Tickets');
    try {
      const tickets = await apiCall('http://localhost:8080/api/dashboard/tickets');
      testResults.getTickets = {
        success: true,
        data: tickets,
        count: tickets.length,
        message: `Successfully retrieved ${tickets.length} tickets`
      };
      testResults.summary.passed++;
      console.log('✅ [TEST 2] GET All Tickets PASSED:', testResults.getTickets.message);
    } catch (error) {
      testResults.getTickets = {
        success: false,
        error: error.message,
        message: 'Failed to retrieve tickets'
      };
      testResults.summary.failed++;
      console.log('❌ [TEST 2] GET All Tickets FAILED:', error.message);
    }
    testResults.summary.total++;

    // 3. CREATE Ticket
    console.log('\n🔍 [TEST 3] CREATE Ticket');
    let createdTicketId = null;
    try {
      const createdTicket = await apiCall('http://localhost:8080/api/dashboard/tickets', {
        method: 'POST',
        body: JSON.stringify(testTicket)
      });
      createdTicketId = createdTicket.id;
      testResults.createTicket = {
        success: true,
        data: createdTicket,
        message: `Successfully created ticket with ID: ${createdTicket.id}`
      };
      testResults.summary.passed++;
      console.log('✅ [TEST 3] CREATE Ticket PASSED:', testResults.createTicket.message);
    } catch (error) {
      testResults.createTicket = {
        success: false,
        error: error.message,
        message: 'Failed to create ticket'
      };
      testResults.summary.failed++;
      console.log('❌ [TEST 3] CREATE Ticket FAILED:', error.message);
    }
    testResults.summary.total++;

    // 4. GET Ticket by ID (only if creation was successful)
    if (createdTicketId) {
      console.log('\n🔍 [TEST 4] GET Ticket by ID');
      try {
        const ticket = await apiCall(`http://localhost:8080/api/dashboard/tickets/${createdTicketId}`);
        testResults.getTicketById = {
          success: true,
          data: ticket,
          message: `Successfully retrieved ticket with ID: ${createdTicketId}`
        };
        testResults.summary.passed++;
        console.log('✅ [TEST 4] GET Ticket by ID PASSED:', testResults.getTicketById.message);
      } catch (error) {
        testResults.getTicketById = {
          success: false,
          error: error.message,
          message: 'Failed to retrieve ticket by ID'
        };
        testResults.summary.failed++;
        console.log('❌ [TEST 4] GET Ticket by ID FAILED:', error.message);
      }
      testResults.summary.total++;

      // 5. UPDATE Ticket
      console.log('\n🔍 [TEST 5] UPDATE Ticket');
      const updatedTicketData = {
        ...testTicket,
        title: 'Updated Test Ticket',
        description: 'This ticket has been updated by the test suite',
        status: 'IN_PROGRESS'
      };
      try {
        const updatedTicket = await apiCall(`http://localhost:8080/api/dashboard/tickets/${createdTicketId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedTicketData)
        });
        testResults.updateTicket = {
          success: true,
          data: updatedTicket,
          message: `Successfully updated ticket with ID: ${createdTicketId}`
        };
        testResults.summary.passed++;
        console.log('✅ [TEST 5] UPDATE Ticket PASSED:', testResults.updateTicket.message);
      } catch (error) {
        testResults.updateTicket = {
          success: false,
          error: error.message,
          message: 'Failed to update ticket'
        };
        testResults.summary.failed++;
        console.log('❌ [TEST 5] UPDATE Ticket FAILED:', error.message);
      }
      testResults.summary.total++;

      // 6. DELETE Ticket
      console.log('\n🔍 [TEST 6] DELETE Ticket');
      try {
        await apiCall(`http://localhost:8080/api/dashboard/tickets/${createdTicketId}`, {
          method: 'DELETE'
        });
        testResults.deleteTicket = {
          success: true,
          message: `Successfully deleted ticket with ID: ${createdTicketId}`
        };
        testResults.summary.passed++;
        console.log('✅ [TEST 6] DELETE Ticket PASSED:', testResults.deleteTicket.message);
      } catch (error) {
        testResults.deleteTicket = {
          success: false,
          error: error.message,
          message: 'Failed to delete ticket'
        };
        testResults.summary.failed++;
        console.log('❌ [TEST 6] DELETE Ticket FAILED:', error.message);
      }
      testResults.summary.total++;
    } else {
      console.log('\n⏭️ [SKIP] Skipping GET/UPDATE/DELETE tests due to failed ticket creation');
    }

    // 7. GET Dashboard Stats
    console.log('\n🔍 [TEST 7] GET Dashboard Stats');
    try {
      const stats = await apiCall('http://localhost:8080/api/dashboard/dashboard/stats');
      testResults.getDashboardStats = {
        success: true,
        data: stats,
        message: 'Successfully retrieved dashboard statistics'
      };
      testResults.summary.passed++;
      console.log('✅ [TEST 7] GET Dashboard Stats PASSED:', testResults.getDashboardStats.message);
    } catch (error) {
      testResults.getDashboardStats = {
        success: false,
        error: error.message,
        message: 'Failed to retrieve dashboard stats'
      };
      testResults.summary.failed++;
      console.log('❌ [TEST 7] GET Dashboard Stats FAILED:', error.message);
    }
    testResults.summary.total++;

  } catch (error) {
    console.error('💥 [TEST SUITE] Unexpected error during test execution:', error);
  }

  // Print Summary
  console.log('\n📊 [TEST SUITE SUMMARY]');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  
  console.log('\n📋 [DETAILED RESULTS]');
  Object.keys(testResults).forEach(key => {
    if (key !== 'summary' && testResults[key]) {
      const result = testResults[key];
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${key}: ${result.message}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  });

  return testResults;
};

// Network Performance Test
export const runNetworkPerformanceTest = async () => {
  console.log('⚡ [PERFORMANCE TEST] Starting network performance analysis');
  
  const testUrl = 'http://localhost:8080/api/dashboard/tickets';
  const iterations = 5;
  const results = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    try {
      await apiCall(testUrl);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      results.push(responseTime);
      console.log(`📡 [PERF] Request ${i + 1}: ${responseTime}ms`);
    } catch (error) {
      console.log(`❌ [PERF] Request ${i + 1}: Failed - ${error.message}`);
      results.push(null);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const validResults = results.filter(r => r !== null);
  if (validResults.length > 0) {
    const avgResponseTime = validResults.reduce((a, b) => a + b, 0) / validResults.length;
    const minResponseTime = Math.min(...validResults);
    const maxResponseTime = Math.max(...validResults);

    console.log('\n📊 [PERFORMANCE SUMMARY]');
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Min Response Time: ${minResponseTime}ms`);
    console.log(`Max Response Time: ${maxResponseTime}ms`);
    console.log(`Success Rate: ${(validResults.length / iterations * 100).toFixed(1)}%`);
  }

  return {
    results,
    average: validResults.reduce((a, b) => a + b, 0) / validResults.length,
    successRate: (validResults.length / iterations) * 100
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runAPITestSuite = runAPITestSuite;
  window.runNetworkPerformanceTest = runNetworkPerformanceTest;
  console.log('🧪 [API TEST] Test suite loaded. Use runAPITestSuite() or runNetworkPerformanceTest() in console');
}

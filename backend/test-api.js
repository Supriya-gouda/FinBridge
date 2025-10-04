// Test script for Smart Alerts & Financial Health APIs
// Run with: node test-api.js

const API_BASE_URL = 'http://localhost:4000/api';
const TEST_USER_ID = 'test-user-123';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': TEST_USER_ID,
        ...options.headers
      }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    console.log(`${options.method || 'GET'} ${endpoint}:`, {
      status: response.status,
      success: data.success,
      data: data.data ? (Array.isArray(data.data) ? `${data.data.length} items` : 'object') : 'none',
      error: data.error
    });
    
    return data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing FinBridge API endpoints...\n');

  // Test 1: Health Check
  console.log('1. Health Check');
  await apiCall('/health');
  console.log();

  // Test 2: Create Sample Alert
  console.log('2. Create Sample Alert');
  const alertData = {
    type: 'bill',
    title: 'Test Credit Card Bill',
    description: 'Test alert for API demonstration',
    amount: 12500,
    dueDate: '2025-10-15',
    priority: 'high',
    frequency: 'monthly'
  };
  
  const createResult = await apiCall('/alerts', {
    method: 'POST',
    body: JSON.stringify(alertData)
  });
  const alertId = createResult.data?.id;
  console.log();

  // Test 3: Get User Alerts
  console.log('3. Get User Alerts');
  await apiCall('/alerts');
  console.log();

  // Test 4: Get Upcoming Alerts
  console.log('4. Get Upcoming Alerts');
  await apiCall('/alerts/upcoming');
  console.log();

  // Test 5: Mark Alert as Read (if we have an alert ID)
  if (alertId) {
    console.log('5. Mark Alert as Read');
    await apiCall(`/alerts/${alertId}/read`, { method: 'PATCH' });
    console.log();
  }

  // Test 6: Get Alert Settings
  console.log('6. Get Alert Settings');
  await apiCall('/alerts/settings');
  console.log();

  // Test 7: Update Alert Settings
  console.log('7. Update Alert Settings');
  const settingsData = {
    bill_reminders: true,
    investment_opportunities: true,
    budget_limit: 30000,
    emergency_fund_target: 200000
  };
  
  await apiCall('/alerts/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData)
  });
  console.log();

  // Test 8: Get Financial Health Score
  console.log('8. Get Financial Health Score');
  await apiCall('/health-score');
  console.log();

  // Test 9: Calculate New Score
  console.log('9. Calculate New Financial Health Score');
  await apiCall('/health-score/calculate', { method: 'POST' });
  console.log();

  // Test 10: Get Score Breakdown
  console.log('10. Get Score Breakdown');
  await apiCall('/health-score/breakdown');
  console.log();

  // Test 11: Get Resilience Insights
  console.log('11. Get Resilience Insights');
  await apiCall('/resilience/insights');
  console.log();

  // Test 12: Get Score History
  console.log('12. Get Score History');
  await apiCall('/health-score/history?months=3');
  console.log();

  // Test 13: Generate Automatic Alerts
  console.log('13. Generate Automatic Alerts');
  await apiCall('/alerts/generate', { method: 'POST' });
  console.log();

  // Test 14: Delete Test Alert (cleanup)
  if (alertId) {
    console.log('14. Delete Test Alert (Cleanup)');
    await apiCall(`/alerts/${alertId}`, { method: 'DELETE' });
    console.log();
  }

  console.log('✅ API testing completed!');
  console.log('\nNotes:');
  console.log('- Some endpoints may return errors if database is not set up');
  console.log('- Score calculation requires transaction and goal data');
  console.log('- Automatic alert generation needs user data to be meaningful');
}

// Run the tests
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('Install: npm install node-fetch');
  console.log('Or use: node --experimental-fetch test-api.js');
} else {
  runTests().catch(console.error);
}

module.exports = { apiCall, runTests };
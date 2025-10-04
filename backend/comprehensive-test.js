// Comprehensive API Testing Script for FinBridge Backend
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_BASE_URL = 'http://localhost:4000';
const TEST_USER_ID = 'test-user-123';

class APITester {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  async makeRequest(method, url, body = null, headers = {}) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': TEST_USER_ID,
          ...headers
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      console.log(`\n🔍 ${method} ${url}`);
      if (body) console.log('📤 Request Body:', JSON.stringify(body, null, 2));

      const response = await fetch(url, options);
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }

      console.log(`📊 Status: ${response.status}`);
      console.log(`📥 Response:`, typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData);

      return {
        status: response.status,
        ok: response.ok,
        data: responseData
      };
    } catch (error) {
      console.error(`❌ Request failed:`, error.message);
      return {
        status: 0,
        ok: false,
        error: error.message
      };
    }
  }

  recordTest(name, passed, message = '') {
    this.totalTests++;
    if (passed) {
      this.passedTests++;
      console.log(`✅ ${name} ${message}`);
    } else {
      this.failedTests++;
      console.log(`❌ ${name} ${message}`);
    }
    
    this.testResults.push({
      name,
      passed,
      message
    });
  }

  async testHealthEndpoints() {
    console.log('\n🏥 Testing Health Endpoints...');
    
    // Test main health endpoint
    const healthResponse = await this.makeRequest('GET', `${API_BASE_URL}/health`);
    this.recordTest(
      'Health Check Endpoint',
      healthResponse.ok && healthResponse.data.status === 'ok',
      healthResponse.ok ? 'Working' : `Failed with status ${healthResponse.status}`
    );

    // Test API health endpoint
    const apiHealthResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/health`);
    this.recordTest(
      'API Health Check Endpoint',
      apiHealthResponse.ok && apiHealthResponse.data.status === 'ok',
      apiHealthResponse.ok ? 'Working' : `Failed with status ${apiHealthResponse.status}`
    );
  }

  async testSmartAlertsAPI() {
    console.log('\n🔔 Testing Smart Alerts API...');

    // Test creating an alert
    const newAlert = {
      alert_type: 'bill',
      title: 'Test Credit Card Bill',
      description: 'Your test credit card bill is due in 3 days',
      priority: 'high',
      due_date: '2025-01-15',
      amount: 5000
    };

    const createResponse = await this.makeRequest('POST', `${API_BASE_URL}/api/alerts`, newAlert);
    this.recordTest(
      'Create Alert',
      createResponse.ok,
      createResponse.ok ? 'Alert created successfully' : `Failed with status ${createResponse.status}`
    );

    // Test getting user alerts
    const getAlertsResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/alerts`);
    this.recordTest(
      'Get User Alerts',
      getAlertsResponse.ok,
      getAlertsResponse.ok ? `Retrieved alerts` : `Failed with status ${getAlertsResponse.status}`
    );

    // Test getting alerts with filters
    const filteredAlertsResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/alerts?type=bill&priority=high`);
    this.recordTest(
      'Get Filtered Alerts',
      filteredAlertsResponse.ok,
      filteredAlertsResponse.ok ? 'Filters working' : `Failed with status ${filteredAlertsResponse.status}`
    );

    // Test upcoming alerts
    const upcomingResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/alerts/upcoming`);
    this.recordTest(
      'Get Upcoming Alerts',
      upcomingResponse.ok,
      upcomingResponse.ok ? 'Upcoming alerts endpoint working' : `Failed with status ${upcomingResponse.status}`
    );

    // Test generating automatic alerts
    const generateResponse = await this.makeRequest('POST', `${API_BASE_URL}/api/alerts/generate`);
    this.recordTest(
      'Generate Automatic Alerts',
      generateResponse.ok,
      generateResponse.ok ? 'Auto-generation working' : `Failed with status ${generateResponse.status}`
    );

    // Test getting alert settings
    const settingsResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/alerts/settings`);
    this.recordTest(
      'Get Alert Settings',
      settingsResponse.ok,
      settingsResponse.ok ? 'Settings endpoint working' : `Failed with status ${settingsResponse.status}`
    );

    // Test updating alert settings
    const updateSettingsResponse = await this.makeRequest('PUT', `${API_BASE_URL}/api/alerts/settings`, {
      bill_reminders: true,
      investment_opportunities: false,
      budget_limit: 30000
    });
    this.recordTest(
      'Update Alert Settings',
      updateSettingsResponse.ok,
      updateSettingsResponse.ok ? 'Settings update working' : `Failed with status ${updateSettingsResponse.status}`
    );

    // If we have alerts, test marking one as read
    if (getAlertsResponse.ok && getAlertsResponse.data.data && getAlertsResponse.data.data.length > 0) {
      const alertId = getAlertsResponse.data.data[0].id;
      const markReadResponse = await this.makeRequest('PATCH', `${API_BASE_URL}/api/alerts/${alertId}/read`);
      this.recordTest(
        'Mark Alert as Read',
        markReadResponse.ok,
        markReadResponse.ok ? 'Mark as read working' : `Failed with status ${markReadResponse.status}`
      );

      // Test deleting alert
      const deleteResponse = await this.makeRequest('DELETE', `${API_BASE_URL}/api/alerts/${alertId}`);
      this.recordTest(
        'Delete Alert',
        deleteResponse.ok,
        deleteResponse.ok ? 'Delete working' : `Failed with status ${deleteResponse.status}`
      );
    }
  }

  async testFinancialHealthAPI() {
    console.log('\n📊 Testing Financial Health API...');

    // Test calculating new score
    const calculateResponse = await this.makeRequest('POST', `${API_BASE_URL}/api/health-score/calculate`);
    this.recordTest(
      'Calculate Financial Health Score',
      calculateResponse.ok,
      calculateResponse.ok ? 'Score calculation working' : `Failed with status ${calculateResponse.status}`
    );

    // Test getting latest score
    const getScoreResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/health-score`);
    this.recordTest(
      'Get Latest Score',
      getScoreResponse.ok,
      getScoreResponse.ok ? 'Score retrieval working' : `Failed with status ${getScoreResponse.status}`
    );

    // Test getting score breakdown
    const breakdownResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/health-score/breakdown`);
    this.recordTest(
      'Get Score Breakdown',
      breakdownResponse.ok,
      breakdownResponse.ok ? 'Breakdown working' : `Failed with status ${breakdownResponse.status}`
    );

    // Test getting score history
    const historyResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/health-score/history`);
    this.recordTest(
      'Get Score History',
      historyResponse.ok,
      historyResponse.ok ? 'History working' : `Failed with status ${historyResponse.status}`
    );

    // Test resilience insights
    const insightsResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/resilience/insights`);
    this.recordTest(
      'Get Resilience Insights',
      insightsResponse.ok,
      insightsResponse.ok ? 'Insights working' : `Failed with status ${insightsResponse.status}`
    );
  }

  async testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');

    // Test endpoint without authentication
    const noAuthResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/alerts`, null, { 'X-User-ID': undefined });
    this.recordTest(
      'Authentication Required',
      !noAuthResponse.ok && noAuthResponse.status === 401,
      noAuthResponse.status === 401 ? 'Correctly requires authentication' : 'Authentication check not working'
    );

    // Test invalid alert creation
    const invalidAlertResponse = await this.makeRequest('POST', `${API_BASE_URL}/api/alerts`, {
      // Missing required fields
      description: 'Invalid alert'
    });
    this.recordTest(
      'Invalid Data Validation',
      !invalidAlertResponse.ok,
      !invalidAlertResponse.ok ? 'Validation working' : 'Should reject invalid data'
    );

    // Test non-existent endpoint
    const notFoundResponse = await this.makeRequest('GET', `${API_BASE_URL}/api/nonexistent`);
    this.recordTest(
      '404 Error Handling',
      notFoundResponse.status === 404,
      notFoundResponse.status === 404 ? '404 handled correctly' : 'Should return 404 for unknown endpoints'
    );
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive API Tests for FinBridge Backend\n');
    console.log('=' .repeat(60));

    try {
      await this.testHealthEndpoints();
      await this.testSmartAlertsAPI();
      await this.testFinancialHealthAPI();
      await this.testErrorHandling();

      console.log('\n' + '=' .repeat(60));
      console.log('📊 TEST SUMMARY');
      console.log('=' .repeat(60));
      console.log(`Total Tests: ${this.totalTests}`);
      console.log(`Passed: ${this.passedTests} ✅`);
      console.log(`Failed: ${this.failedTests} ❌`);
      console.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);

      if (this.failedTests > 0) {
        console.log('\n❌ FAILED TESTS:');
        this.testResults
          .filter(test => !test.passed)
          .forEach(test => {
            console.log(`   - ${test.name}: ${test.message}`);
          });
      }

      console.log('\n🎯 RECOMMENDATIONS:');
      if (this.failedTests === 0) {
        console.log('✅ All tests passed! Your API is working correctly.');
        console.log('✅ Ready for database migration and frontend integration.');
      } else {
        console.log('⚠️ Some tests failed. Please review the failed endpoints.');
        console.log('⚠️ Check Supabase connection if database-related tests fail.');
        console.log('⚠️ Run database migration if tables are missing.');
      }

      console.log('\n📋 NEXT STEPS:');
      console.log('1. Run the database migration (SETUP_DATABASE.sql) in Supabase');
      console.log('2. Update frontend API calls to use correct endpoints');
      console.log('3. Test frontend integration');
      console.log('4. Deploy to production environment');

    } catch (error) {
      console.error('\n❌ Test suite failed with error:', error);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests();
}

module.exports = APITester;
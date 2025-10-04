const http = require('http');

const BASE_URL = 'localhost';
const PORT = 4000;

// Test data for personality assessment
const testAssessmentData = {
  userId: 'demo-user-123',
  answers: {
    salary_approach: 'review_budget',
    risk_tolerance: 'calculated_risks',
    planning_approach: 'detailed_longterm',
    purchase_decision: 'extensive_research',
    emergency_fund: 'one_to_three_months',
    investment_knowledge: 'some_knowledge'
  }
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': 'demo-user-123'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testPersonalityProfilerAPI() {
  console.log('🧪 Testing Personality Profiler API Endpoints\n');

  try {
    // Test 1: Complete Assessment
    console.log('1️⃣ Testing Complete Assessment...');
    const assessmentResponse = await makeRequest('POST', '/personality-profiler/assessment', testAssessmentData);
    console.log('Response Status:', assessmentResponse.status);
    if (assessmentResponse.status === 200 || assessmentResponse.status === 201) {
      console.log('✅ Assessment completed:', {
        personality_type: assessmentResponse.data.personality_type,
        confidence_level: assessmentResponse.data.confidence_level
      });
    } else {
      console.log('❌ Assessment failed:', assessmentResponse.data);
    }

    // Test 2: Get User Profile
    console.log('\n2️⃣ Testing Get User Profile...');
    const profileResponse = await makeRequest('GET', `/personality-profiler/profile/${testAssessmentData.userId}`);
    console.log('Response Status:', profileResponse.status);
    if (profileResponse.status === 200) {
      console.log('✅ Profile retrieved:', {
        personality_type: profileResponse.data.personality_type,
        confidence_level: profileResponse.data.confidence_level
      });
    } else {
      console.log('❌ Profile retrieval failed:', profileResponse.data);
    }

    // Test 3: Get Challenges
    console.log('\n3️⃣ Testing Get Challenges...');
    const challengesResponse = await makeRequest('GET', `/personality-profiler/challenges/${testAssessmentData.userId}`);
    console.log('Response Status:', challengesResponse.status);
    if (challengesResponse.status === 200) {
      console.log('✅ Challenges retrieved:', challengesResponse.data.length, 'challenges found');
    } else {
      console.log('❌ Challenges retrieval failed:', challengesResponse.data);
    }

    // Test 4: Get Behavioral Insights
    console.log('\n4️⃣ Testing Get Behavioral Insights...');
    const insightsResponse = await makeRequest('GET', `/personality-profiler/insights/${testAssessmentData.userId}`);
    console.log('Response Status:', insightsResponse.status);
    if (insightsResponse.status === 200) {
      console.log('✅ Behavioral insights retrieved:', {
        personality_type: insightsResponse.data.personality_type,
        insights_count: insightsResponse.data.insights ? insightsResponse.data.insights.length : 0
      });
    } else {
      console.log('❌ Insights retrieval failed:', insightsResponse.data);
    }

    console.log('\n🎉 Personality Profiler API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testPersonalityProfilerAPI();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Enable CORS for all routes (allows frontend to communicate with backend)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Support both Vite default and custom port
  credentials: true
}));

app.use(express.json());

// Mock database for crowd wisdom (in production, this would be Supabase)
let crowdWisdomData = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// POST endpoint to save user metrics
app.post('/api/crowd/metrics', (req, res) => {
  try {
    const { user_id, metric, value } = req.body;
    
    if (!user_id || !metric || value === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, metric, value' 
      });
    }

    if (typeof value !== 'number' || value < 0) {
      return res.status(400).json({ 
        error: 'Value must be a positive number' 
      });
    }

    // Remove existing entry for this user and metric to keep latest only
    crowdWisdomData = crowdWisdomData.filter(
      item => !(item.user_id === user_id && item.metric === metric)
    );

    // Add new entry
    const newEntry = {
      id: Date.now() + Math.random(),
      user_id,
      metric,
      value: parseFloat(value),
      created_at: new Date().toISOString()
    };

    crowdWisdomData.push(newEntry);

    res.json({ 
      success: true, 
      message: 'Metric saved successfully',
      data: newEntry 
    });

  } catch (error) {
    console.error('Error saving metric:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to compare user metrics with crowd
app.get('/api/crowd/compare/:userId/:metric', (req, res) => {
  try {
    const { userId, metric } = req.params;
    
    if (!userId || !metric) {
      return res.status(400).json({ 
        error: 'Missing userId or metric parameter' 
      });
    }

    // Get all data for this metric
    const metricData = crowdWisdomData.filter(item => item.metric === metric);
    
    if (metricData.length === 0) {
      return res.status(404).json({ 
        error: 'No data found for this metric' 
      });
    }

    // Find user's value
    const userEntry = metricData.find(item => item.user_id === userId);
    
    if (!userEntry) {
      return res.status(404).json({ 
        error: 'No data found for this user and metric' 
      });
    }

    const userValue = userEntry.value;
    
    // Calculate statistics
    const values = metricData.map(item => item.value);
    const totalUsers = values.length;
    const averageValue = values.reduce((sum, val) => sum + val, 0) / totalUsers;
    
    // Calculate percentile rank (percentage of users with values below user's value)
    const usersBelowCount = values.filter(val => val < userValue).length;
    const percentileRank = Math.round((usersBelowCount / totalUsers) * 100);

    res.json({
      userValue,
      averageValue: Math.round(averageValue * 100) / 100, // Round to 2 decimal places
      percentileRank,
      totalUsers,
      metric
    });

  } catch (error) {
    console.error('Error comparing metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('FinBridge backend is running');
});

app.listen(port, () => {
  console.log(`FinBridge backend listening on port ${port}`);
});

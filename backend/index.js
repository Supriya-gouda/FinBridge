// Load environment variables first - specify path explicitly
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🚀 Starting FinBridge Backend...');
console.log('📝 Environment variables loaded from:', path.join(__dirname, '.env'));
console.log('📂 Current directory:', __dirname);
console.log('🔗 Supabase URL:', process.env.SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('🔑 Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
console.log('🔌 Port:', process.env.PORT || '4000 (default)');

const express = require('express');
const cors = require('cors');

console.log('📦 Loading modules...');

try {
  const { initializeDatabase } = require('./models/database');
  const smartAlertsRoutes = require('./routes/smartAlerts');
  const financialHealthRoutes = require('./routes/financialHealth');
  console.log('✅ All modules loaded successfully');

  const app = express();
  const port = process.env.PORT || 4000;

  // Enable CORS for all routes (allows frontend to communicate with backend)
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite and React dev ports
    credentials: true
  }));

  app.use(express.json());

  console.log('🔧 Configuring routes...');

  // Initialize database schema on startup
  initializeDatabase();

  // API Routes
  app.use('/api', smartAlertsRoutes);
  app.use('/api', financialHealthRoutes);

  // Health check endpoint (separate from API routes)
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      uptime: process.uptime(),
      features: [
        'Smart Alerts',
        'Financial Health Score',
        'Database Integration'
      ]
    });
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'FinBridge API is running',
      uptime: process.uptime(),
      endpoints: {
        'smart_alerts': '/api/alerts',
        'financial_health': '/api/health-score'
      }
    });
  });

  app.get('/', (req, res) => {
    res.send('FinBridge backend is running with Smart Alerts & Financial Health features');
  });

  app.listen(port, () => {
    console.log(`✅ FinBridge backend listening on port ${port}`);
    console.log(`🌐 Health check: http://localhost:${port}/health`);
    console.log(`🔌 API endpoints: http://localhost:${port}/api/health`);
  });

} catch (error) {
  console.error('❌ Error starting backend:', error);
  process.exit(1);
}

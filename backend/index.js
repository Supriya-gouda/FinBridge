const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Enable CORS for all routes (allows frontend to communicate with backend)
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.send('FinBridge backend is running');
});

app.listen(port, () => {
  console.log(`FinBridge backend listening on port ${port}`);
});

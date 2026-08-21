const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5173;

// Allow your Vite frontend (likely on localhost:5173 or similar) to call this API
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to your Node.js backend API!' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date() });
});

// --- 404 + error handling (keep these LAST) ---
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Application is live and running on http://localhost:${PORT}`);
});

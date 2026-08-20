const express = require('express');
const app = express();
const PORT = process.env.PORT || 5173;

// Middleware to automatically parse incoming JSON data
app.use(express.json());

// Base Route (Home page)
app.get('/', (req, res) =>
     {
  res.json({ message: "Welcome to your Node.js backend API!" });
});

// Example Data Route
app.get('/api/status', (req, res) => 
    {
  res.json({ status: "Online", timestamp: new Date() });
});

// Start the server
app.listen(PORT, () => 
    {
  console.log(`Application is live and running on http://localhost:${PORT}`);
});

require('dotenv').config(); // THIS MUST BE ON LINE 1
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Adding temporary console log to debug:
console.log("Supabase URL Check:", process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Importing  Routes
const appointmentRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patients');
const queueRoutes = require('./routes/queue');

// Defining API Endpoints
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/queue', queueRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "Swasthya Saathi Backend is running" });
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

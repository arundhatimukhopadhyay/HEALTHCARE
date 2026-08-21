const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET /api/appointments - list all appointments
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('queue').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/appointments - book a new appointment
router.post('/', async (req, res) => {
  const { patientId, reason } = req.body;
  if (!patientId) return res.status(400).json({ error: 'patientId is required' });

  const { data, error } = await supabase
    .from('queue')
    .insert({ patient_id: patientId, reason })
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

module.exports = router;

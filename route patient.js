const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// GET /api/patients - list all patients
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'patient');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/patients/:id - get one patient
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

module.exports = router;

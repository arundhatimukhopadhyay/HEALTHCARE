const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// PATIENT SIDE: Get my upcoming appointments
router.get('/patient/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', req.params.id)
        .order('date', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// HEALTH WORKER SIDE: Get Today's Appointments
router.get('/today', async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const { data, error } = await supabase
        .from('appointments')
        .select('*, profiles(full_name)') // Assuming a join with profiles
        .eq('appointment_date', today);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;

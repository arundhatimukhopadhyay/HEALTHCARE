const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// PATIENT: Get My Profile
router.get('/profile/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('name, identifier, village, role')
        .eq('id', req.params.id)
        .single();
    if (error) return res.status(400).json(error);
    res.json(data);
});

// PATIENT: Get Medical Timeline (Past Appointments)
router.get('/timeline/:patientId', async (req, res) => {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', req.params.patientId)
        .order('id', { ascending: false });
    if (error) return res.status(400).json(error);
    res.json(data);
});

// EMERGENCY: Create Escalation (SOS)
router.post('/sos', async (req, res) => {
    const { patient_id, latitude, longitude } = req.body;
    const { data, error } = await supabase
        .from('escalations')
        .insert([{ patient_id, latitude, longitude, status: 'DISPATCHED' }]);
    if (error) return res.status(400).json(error);
    res.json({ message: "SOS Sent! Help is on the way.", data });
});

module.exports = router;
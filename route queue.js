const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// PATIENT SIDE: Get current position in line
router.get('/status/:patientId', async (req, res) => {
    // Logic: Count how many people are 'waiting' and joined before this patient
    const { data, error } = await supabase
        .from('queue')
        .select('*')
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    
    const position = data.findIndex(p => p.patient_id === req.params.patientId) + 1;
    res.json({ position, total_waiting: data.length });
});

// WORKER SIDE: Call next patient (Update status)
router.patch('/next', async (req, res) => {
    const { queueId } = req.body;
    const { data, error } = await supabase
        .from('queue')
        .update({ status: 'in-consultation' })
        .eq('id', queueId);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Next patient called", data });
});

module.exports = router;

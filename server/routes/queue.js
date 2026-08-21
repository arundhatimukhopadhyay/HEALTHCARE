const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// PATIENT: Check how many people are ahead of me
router.get('/status/:appointmentId', async (req, res) => {
    // 1. Get current appointment's token
    const { data: current } = await supabase
        .from('appointments')
        .select('token_number')
        .eq('id', req.params.appointmentId)
        .single();

    // 2. Count appointments with smaller token numbers that aren't 'completed'
    const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .lt('token_number', current.token_number)
        .eq('status', 'waiting');

    if (error) return res.status(400).json(error);
    res.json({ ahead_of_you: count });
});

module.exports = router;
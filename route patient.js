const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // Import the initialized client

// Example: Get patient profile
router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.params.id);
    
    if (error) return res.status(400).json(error);
    res.json(data);
});

module.exports = router;

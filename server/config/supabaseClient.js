
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // This loads the variables from your .env file

// Access the variables from process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

// Initialize the client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
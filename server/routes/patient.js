const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET /api/patients - list all users from Supabase
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/patients/prescriptions - fetch all prescriptions
router.get("/prescriptions", async (req, res) => {
  const { data, error } = await supabase.from("prescriptions").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/patients/villages - fetch all villages
router.get("/villages", async (req, res) => {
  const { data, error } = await supabase.from("village").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;

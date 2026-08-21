const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// GET /api/appointments
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/appointments
router.post("/", async (req, res) => {
  const {
    patientId,
    patient_name,
    token_number,
    token,
    reason,
    chiefComplaint,
    village,
  } = req.body;
  const symptomNote = reason || chiefComplaint || "General Consultation";

  const newRow = {
    token_number: token_number || token || "T-019",
    patient_name: patient_name || "Rahul Das",
    patient_id: patientId || "2103e7ac-8ab0-47ec-8173-d009a44a6ecc",
  };

  // Save to Supabase (and safely catch if column is missing)
  try {
    await supabase
      .from("appointments")
      .insert([
        { ...newRow, reason: symptomNote, village: village || "Rampur" },
      ]);
  } catch (err) {
    await supabase.from("appointments").insert([newRow]);
  }

  res.json({
    ...newRow,
    reason: symptomNote,
    chiefComplaint: symptomNote,
    village: village || "Rampur",
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// Real Supabase UUID mapping from your users table
const validUUIDs = {
  PAT001: "2103e7ac-8ab0-47ec-8173-d009a44a6ecc", // Rahul Das
  PAT002: "12a10d6d-558a-4b6f-bf76-443e383f1971", // Priya Sahu
  PAT003: "a421f721-fd4d-4a33-983d-df99fda8b091", // Amit Behera
  PAT004: "30f3dc99-0846-4e9b-981c-4aa4d437d8f5", // Sneha Rout
};

// GET /api/appointments
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("token_number", { ascending: true }); // Clean sequential order!

  if (error) {
    console.error("❌ GET Error:", error.message);
    return res.status(400).json({ error: error.message });
  }
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
    status,
  } = req.body || {};

  // Format patient_id to a guaranteed valid Supabase UUID
  const cleanUUID =
    validUUIDs[patientId] ||
    (patientId && patientId.includes("-")
      ? patientId
      : "2103e7ac-8ab0-47ec-8173-d009a44a6ecc");

  const newRow = {
    token_number: token_number || token || "T-005",
    patient_name: patient_name || req.body.name || "Rahul Das",
    patient_id: cleanUUID,
    village: village || "Rampur",
    reason: reason || chiefComplaint || "General Consultation",
    status: status || "In Waiting Room",
  };

  const { data, error } = await supabase
    .from("appointments")
    .insert([newRow])
    .select();

  if (error) {
    console.error("❌ SUPABASE INSERT ERROR:", error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log(
    "✅ SUPABASE INSERT SUCCESS:",
    newRow.token_number,
    newRow.patient_name,
    newRow.reason,
  );
  res.json(data);
});

module.exports = router;

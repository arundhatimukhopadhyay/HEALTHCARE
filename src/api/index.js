const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const supabaseUrl =
  process.env.SUPABASE_URL || "https://ybsozuyhuhronofsegia.supabase.co";
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || "sb_secret_1bEGEc4W7Eaf7Vl_3dDtBg_-GeNtMbA";

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Patients Endpoint
app.get("/api/patients", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 2. Appointments Endpoint (Fetch Queue)
app.get("/api/appointments", async (req, res) => {
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 3. Book Appointment Endpoint
app.post("/api/appointments", async (req, res) => {
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

// 4. Prescriptions Endpoint
app.get("/api/prescriptions/:id", async (req, res) => {
  const { data, error } = await supabase.from("prescriptions").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = app;

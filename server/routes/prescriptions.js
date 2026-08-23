const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

// PATIENT: Get my prescriptions
router.get("/my-meds/:patientId", async (req, res) => {
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("patient_id", req.params.patientId);
  if (error) return res.status(400).json(error);
  res.json(data);
});

// WORKER: Issue new prescription
router.post("/add", async (req, res) => {
  const { patient_id, medicine_name, time_slot } = req.body;
  const { data, error } = await supabase
    .from("prescriptions")
    .insert([{ patient_id, medicine_name, time_slot, is_taken: false }]);
  if (error) return res.status(400).json(error);
  res.json({ message: "Prescription added", data });
});

module.exports = router;

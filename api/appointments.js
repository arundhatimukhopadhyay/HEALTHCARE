const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL || "https://ybsozuyhuhronofsegia.supabase.co",
  process.env.SUPABASE_ANON_KEY || "sb_secret_1bEGEc4W7Eaf7Vl_3dDtBg_-GeNtMbA",
);

const validUUIDs = {
  PAT001: "2103e7ac-8ab0-47ec-8173-d009a44a6ecc", // Rahul Das
  PAT002: "12a10d6d-558a-4b6f-bf76-443e383f1971", // Priya Sahu
  PAT003: "a421f721-fd4d-4a33-983d-df99fda8b091", // Amit Behera
  PAT004: "30f3dc99-0846-4e9b-981c-4aa4d437d8f5", // Sneha Rout
};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // POST: Book a new appointment
  if (req.method === "POST") {
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

    const cleanUUID =
      validUUIDs[patientId] ||
      (patientId && patientId.includes("-")
        ? patientId
        : "2103e7ac-8ab0-47ec-8173-d009a44a6ecc");

    const newRow = {
      token_number: token_number || token || "T-005",
      patient_name: patient_name || req.body?.name || "Rahul Das",
      patient_id: cleanUUID,
      village: village || "Rampur",
      reason: reason || chiefComplaint || "Clinical Consultation",
      status: status || "In Waiting Room",
    };

    const { data, error } = await supabase
      .from("appointments")
      .insert([newRow])
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // GET: Fetch all appointments sorted cleanly by token_number
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("token_number", { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};

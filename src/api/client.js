import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ybsozuyhuhronofsegia.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlic296dXlodWhyb25vZnNlZ2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTEyOTEsImV4cCI6MjEwMjgyNzI5MX0.5uNYV8M7EhkKI6_8nYWC7If0AhYzSTNSmgf37DGWUsg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const validUUIDs = {
  PAT001: "2103e7ac-8ab0-47ec-8173-d009a44a6ecc",
  PAT002: "12a10d6d-558a-4b6f-bf76-443e383f1971",
  PAT003: "a421f721-fd4d-4a33-983d-df99fda8b091",
  PAT004: "30f3dc99-0846-4e9b-981c-4aa4d437d8f5",
};

export async function apiRequest(endpoint, options = {}) {
  const method = options.method || "GET";
  let body = {};
  if (options.body) {
    try {
      body =
        typeof options.body === "string"
          ? JSON.parse(options.body)
          : options.body;
    } catch (e) {
      body = options.body;
    }
  }

  // 1. PATIENTS
  if (endpoint.startsWith("/api/patients")) {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return [];
    return data || [];
  }

  // 2. APPOINTMENTS
  if (endpoint.startsWith("/api/appointments")) {
    if (method === "POST") {
      const cleanUUID =
        validUUIDs[body.patientId] ||
        (body.patientId && body.patientId.includes("-")
          ? body.patientId
          : "2103e7ac-8ab0-47ec-8173-d009a44a6ecc");

      const newRow = {
        token_number: body.token_number || body.token || "T-005",
        patient_name: body.patient_name || body.name || "Rahul Das",
        patient_id: cleanUUID,
        village: body.village || "Rampur",
        reason: body.reason || body.chiefComplaint || "Clinical Consultation",
        status: body.status || "In Waiting Room",
      };

      const { data, error } = await supabase
        .from("appointments")
        .insert([newRow])
        .select();
      if (error) return [newRow];
      return data || [newRow];
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("token_number", { ascending: true });

    if (error) return [];
    return data || [];
  }

  // 3. PRESCRIPTIONS
  if (endpoint.startsWith("/api/prescriptions")) {
    const { data, error } = await supabase.from("prescriptions").select("*");
    if (error) return [];
    return data || [];
  }

  return [];
}

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL || "https://ybsozuyhuhronofsegia.supabase.co",
  process.env.SUPABASE_ANON_KEY || "sb_secret_1bEGEc4W7Eaf7Vl_3dDtBg_-GeNtMbA",
);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL || "https://ybsozuyhuhronofsegia.supabase.co",
  process.env.SUPABASE_ANON_KEY || "sb_secret_1bEGEc4W7Eaf7Vl_3dDtBg_-GeNtMbA",
);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { data, error } = await supabase.from("prescriptions").select("*");
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};

const express = require("express");
const cors = require("cors");
const path = require("path");

// Safely load environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// 1. Safe Route Binding (Handles singular & plural filenames)
try {
  app.use("/api/patients", require("./routes/patients"));
} catch (e) {
  try {
    app.use("/api/patients", require("./routes/patient"));
  } catch (err) {}
}

try {
  app.use("/api/appointments", require("./routes/appointments"));
} catch (e) {
  try {
    app.use("/api/appointments", require("./routes/appointment"));
  } catch (err) {}
}

try {
  app.use("/api/prescriptions", require("./routes/prescriptions"));
} catch (e) {
  try {
    app.use("/api/prescriptions", require("./routes/prescription"));
  } catch (err) {}
}

// 2. Healthcheck Root
app.get("/", (req, res) => {
  res.json({ message: "Community Healthcare API is live and running!" });
});

// 3. Port Listener
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live and running on http://localhost:${PORT}`);
});

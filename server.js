const express = require("express");
const cors = require('cors');


const app = express();

app.use(cors());

const PORT = 3000;

// Parse JSON
app.use(express.json());

// Store live bus locations in memory
let busData = {};  // { imei: { lat, lng, speed, time } }

// Test route
app.get("/", (req, res) => {
  res.send("Bus Tracking Backend is Running!");
});

// API to receive GPS data from device
app.post("/api/location", (req, res) => {
  const { imei, lat, lng, speed } = req.body;

  if (!imei || !lat || !lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Save/update bus data
  busData[imei] = {
    lat,
    lng,
    speed: speed || 0,
    time: new Date().toISOString()
  };

  console.log(`Updated bus ${imei}:`, busData[imei]);
  res.json({ status: "success", bus: imei });
});

// API to get all live bus locations
app.get("/api/locations", (req, res) => {
  res.json(busData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

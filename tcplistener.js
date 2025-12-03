console.log("TCP listener started on port 5000");


const net = require('net');
const axios = require('axios');

// Change port to what device is sending
const PORT = 5000;

const server = net.createServer((socket) => {
  console.log('Device connected');

  socket.on('data', async (data) => {
    const packet = data.toString().trim();
    console.log('Raw data:', packet);

    // Example parse assuming comma-separated fields
    // Adjust indices based on actual packet format
    const fields = packet.split(',');
    const imei = fields[3];
    const lat = parseFloat(fields[6]);
    const latDir = fields[7]; // N/S
    const lng = parseFloat(fields[8]);
    const lngDir = fields[9]; // E/W

    // Convert latitude/longitude based on N/S and E/W
    const latitude = latDir === 'S' ? -lat : lat;
    const longitude = lngDir === 'W' ? -lng : lng;

    // Prepare JSON for backend
    const busData = {
      imei,
      lat: latitude,
      lng: longitude,
      speed: 0 // if device doesn't send speed, use 0
    };

    // POST to your backend
    try {
      await axios.post('http://localhost:3000/api/location', busData);
      console.log('Bus updated:', busData);
    } catch (err) {
      console.error('Error posting to backend:', err.message);
    }
  });

  socket.on('close', () => console.log('Device disconnected'));
});

server.listen(PORT, () => {
  console.log(`TCP server listening on port ${PORT}`);
});

import axios from "axios";

function generateRandomData() {
  return {
    hospitalName: "DOW",
    equipmentName: "ventilator",
    operationalData: [
      Math.floor(Math.random() * 300) + 400, // Tidal Volume (400-700)
      Math.floor(Math.random() * 12) + 12, // Respiratory Rate (12-24)
      Math.floor(Math.random() * 20) + 15, // Peak Pressure (15-35)
      Math.floor(Math.random() * 35) + 21, // FiO2 (21-55)
      Math.floor(Math.random() * 17) + 20, // Temperature (20-37)
      Math.floor(Math.random() * 80) + 20, // Humidity (20-100),
      Math.floor(Math.random() * 5) + 1, // Time parameter ( Current Values: 1-5)
    ],
  };
}

function sendData() {
  const equipmentIds = [
    "UDI-001234567890",
    // "UDI-001234567891", // First Create these equipments
    // "UDI-001234567892",
  ];

  equipmentIds.forEach((equipmentId) => {
    const data = generateRandomData();
    axios
      .post(
        `http://localhost:5000/api/v1/equipments/iot-data/${equipmentId}`,
        data
      )
      .then((response) => {
        console.log(`Data sent for ${equipmentId}:`, data);
        console.log("Server response:", response.data);
      })
      .catch((error) => {
        console.error(`Error sending data for ${equipmentId}:`, error.message);
      });
  });
}

// Send data for each equipment every 5 seconds
setInterval(sendData, 5000);

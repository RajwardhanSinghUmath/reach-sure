require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./utils/db');
const Driver = require('../models/Driver');

// Function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to generate random coordinates near a given point
function getRandomLocation(lat, lon, radiusInKm) {
  const earthRadius = 6371; // Earth's radius in km
  const maxDistance = radiusInKm / earthRadius;
  const randomDistance = Math.sqrt(Math.random()) * maxDistance;
  const randomAngle = Math.random() * 2 * Math.PI;

  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);

  const newLat = Math.asin(
    Math.sin(latRad) * Math.cos(randomDistance) +
      Math.cos(latRad) * Math.sin(randomDistance) * Math.cos(randomAngle)
  );

  const newLon =
    lonRad +
    Math.atan2(
      Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(latRad),
      Math.cos(randomDistance) - Math.sin(latRad) * Math.sin(newLat)
    );

  return [(newLon * 180) / Math.PI, (newLat * 180) / Math.PI]; // [longitude, latitude]
}

// Function to generate random ambulance data
function generateRandomAmbulance(index) {
  const ambulanceTypes = ['BLS', 'ALS - with EMT', 'ALS - without EMT'];
  const statuses = ['online', 'offline'];
  const baseLat = 17.984182536358688;
  const baseLon = 79.532433767047;

  return {
    name: `Driver ${index + 1}`,
    phone: `123456789${index}`,
    ambulanceType: ambulanceTypes[Math.floor(Math.random() * ambulanceTypes.length)],
    licenseNumber: `LIC${Math.floor(Math.random() * 1000)}`,
    location: {
      type: 'Point',
      coordinates: getRandomLocation(baseLat, baseLon, 10), // Random location within 10 km radius
    },
    fixedPrice: Math.floor(getRandomNumber(300, 1000)),
    variablePrice: Math.floor(getRandomNumber(10, 50)),
    ambulanceNumber: `KA01${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
}

// Function to add multiple random ambulances
const addRandomAmbulances = async (count) => {
  await connectDB(); // Ensure MongoDB connection

  try {
    for (let i = 0; i < count; i++) {
      const newDriver = generateRandomAmbulance(i);

      // Check if driver already exists
      const existingDriver = await Driver.findOne({ phone: newDriver.phone });

      if (existingDriver) {
        console.log(`🚨 Driver with phone number ${newDriver.phone} already exists.`);
      } else {
        const driver = await Driver.create(newDriver);
        console.log(`✅ Driver ${i + 1} added successfully:`, driver);
      }
    }
  } catch (error) {
    console.error('❌ Error adding drivers:', error);
  } finally {
    mongoose.connection.close(); // Close connection after operation
  }
};

// Run the function to add 10 random ambulances
addRandomAmbulances(10);
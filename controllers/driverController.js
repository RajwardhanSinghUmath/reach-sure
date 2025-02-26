const Driver = require('../models/Driver');
const logger = require('../utils/logger');

exports.onboardDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    logger.error('Driver onboarding error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { status: req.body.status },
      { new: true }
    );
    res.json(driver);
  } catch (error) {
    logger.error('Driver status update error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      },
      { new: true }
    );
    res.json(driver);
  } catch (error) {
    logger.error('Driver location update error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng, radius = 15 } = req.query;
    const drivers = await Driver.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      },
      status: 'available'
    });
    res.json(drivers);
  } catch (error) {
    logger.error('Nearby drivers fetch error:', error);
    res.status(400).json({ message: error.message });
  }
};

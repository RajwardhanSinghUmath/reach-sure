const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Onboard a new driver
router.post('/onboard', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const driver = await newDriver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch driver details
router.get('/me', async (req, res) => {
  try {
    const driver = await Driver.findOne({ phone: req.query.phone });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update driver status
router.patch('/status', async (req, res) => {
  try {
    const { phone, status } = req.body;
    const driver = await Driver.findOneAndUpdate(
      { phone },
      { status },
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
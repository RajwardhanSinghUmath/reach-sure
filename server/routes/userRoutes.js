const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const logger = require('../utils/logger'); // Add a logger utility

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate input
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (use Redis in production)
    global.otpStore = global.otpStore || {};
    global.otpStore[phoneNumber] = {
      otp,
      createdAt: new Date(),
    };

    // Send OTP via Twilio (uncomment in production)
    /*
    await twilioClient.messages.create({
      body: `Your OTP for ReachSure is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    */

    logger.info(`OTP sent to ${phoneNumber}`);
    res.json({ message: 'OTP sent successfully', otp }); // Remove `otp` in production
  } catch (err) {
    logger.error(`Error sending OTP: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Other routes remain the same...

module.exports = router;
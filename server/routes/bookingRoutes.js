const express = require("express")
const router = express.Router()
const Booking = require("../../models/Booking")
const Driver = require("../../models/Driver")
const { io } = require("../server")
const logger = require("../../app/utils/logger")

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { userPhone, userName, hospital, pickupLocation, ambulanceType, distance } = req.body

    // Validate input
    if (!userPhone || !userName || !hospital || !pickupLocation || !ambulanceType || !distance) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Calculate cost
    const cost = 500 + 20 * distance // Replace with dynamic pricing logic

    const newBooking = new Booking({
      userPhone,
      userName,
      hospital,
      pickupLocation,
      ambulanceType,
      distance,
      cost,
      status: "pending",
    })

    const booking = await newBooking.save()

    // Find nearby drivers (within 15km)
    const nearbyDrivers = await Driver.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: pickupLocation.coordinates,
          },
          $maxDistance: 15000, // 15km in meters
        },
      },
      status: "online",
      ambulanceType,
    })

    // Notify drivers via WebSocket
    io.emit("newBooking", {
      bookingId: booking._id,
      userPhone,
      userName,
      hospital,
      pickupLocation,
      ambulanceType,
      distance,
      cost,
    })

    logger.info(`New booking created: ${booking._id}`)
    res.status(201).json({ booking, driversNotified: nearbyDrivers.length })
  } catch (err) {
    logger.error(`Error creating booking: ${err.message}`)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Other routes remain the same...

module.exports = router


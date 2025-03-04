import connectDB from "@/app/utils/db"
import Booking from "@/models/Booking"
import Driver from "@/models/Driver"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    await connectDB()

    const data = await request.json()
    const { userPhone, userName, hospital, pickupLocation, ambulanceType, distance } = data

    // Validate input
    if (!userPhone || !userName || !hospital || !pickupLocation || !ambulanceType || distance === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate cost
    const cost = 500 + 20 * distance // Basic pricing logic

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
    }).lean()

    // If we can't find drivers with the exact ambulance type, find any available drivers
    const driversToNotify =
      nearbyDrivers.length > 0
        ? nearbyDrivers
        : await Driver.find({
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
          }).lean()

    return NextResponse.json(
      {
        booking,
        driversNotified: driversToNotify.length,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating booking:", error)
    // Return a more detailed error for debugging
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userPhone = searchParams.get("userPhone")

    if (userPhone) {
      const bookings = await Booking.find({ userPhone }).sort({ createdAt: -1 })
      return NextResponse.json({ bookings })
    } else {
      const bookings = await Booking.find().sort({ createdAt: -1 }).limit(20)
      return NextResponse.json({ bookings })
    }
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}


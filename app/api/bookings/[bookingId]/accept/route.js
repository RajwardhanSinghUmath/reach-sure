import connectDB from "@/app/utils/db"
import Booking from "@/models/Booking"
import Driver from "@/models/Driver"
import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  await connectDB()

  try {
    const { bookingId } = params
    const { driverId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if booking is already accepted
    if (booking.status !== "pending") {
      return NextResponse.json({ error: "Booking is already accepted or completed" }, { status: 400 })
    }

    // Find the driver
    const driver = await Driver.findById(driverId)
    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    // Update booking status and assign driver
    booking.status = "accepted"
    booking.driver = driverId
    booking.acceptedAt = new Date()
    await booking.save()

    // Update driver status to busy
    driver.status = "busy"
    await driver.save()

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error("Error accepting booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


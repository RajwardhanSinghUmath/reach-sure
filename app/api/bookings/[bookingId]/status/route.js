import connectDB from "@/app/utils/db"
import Booking from "@/models/Booking"
import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  await connectDB()

  try {
    const { bookingId } = params
    const { status } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Booking ID and status are required" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "accepted", "arrived", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Find and update the booking
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Update status and timestamps
    booking.status = status

    if (status === "arrived") {
      booking.arrivedAt = new Date()
    } else if (status === "completed") {
      booking.completedAt = new Date()
    }

    await booking.save()

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


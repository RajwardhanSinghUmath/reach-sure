import connectDB from "@/app/utils/db"
import Driver from "@/models/Driver"
import { NextResponse } from "next/server"

export async function POST(request) {
  await connectDB()

  try {
    const data = await request.json()

    // Format location data to GeoJSON format if not already
    if (data.location && !data.location.type) {
      data.location = {
        type: "Point",
        coordinates: [data.location.lng, data.location.lat],
      }
    }

    const newDriver = new Driver(data)
    const driver = await newDriver.save()

    return NextResponse.json(driver, { status: 201 })
  } catch (error) {
    console.error("Error onboarding driver:", error)

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Driver with this phone number or license already exists",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


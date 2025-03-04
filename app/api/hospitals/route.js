import connectDB from "@/app/utils/db"
import Hospital from "@/models/Hospital"
import { NextResponse } from "next/server"

export async function GET(request) {
  await connectDB()

  try {
    const { searchParams } = new URL(request.url)
    const lat = Number.parseFloat(searchParams.get("lat"))
    const lng = Number.parseFloat(searchParams.get("lng"))
    const radius = Number.parseInt(searchParams.get("radius") || "10000") // Default 10km in meters

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "Valid lat and lng parameters are required" }, { status: 400 })
    }

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius,
        },
      },
    }).limit(20)

    return NextResponse.json({ hospitals })
  } catch (error) {
    console.error("Error fetching hospitals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  await connectDB()

  try {
    const data = await request.json()

    // Ensure location is in GeoJSON format
    if (!data.location || !data.location.type) {
      if (data.lat !== undefined && data.lng !== undefined) {
        data.location = {
          type: "Point",
          coordinates: [data.lng, data.lat],
        }
      } else {
        return NextResponse.json({ error: "Valid location data is required" }, { status: 400 })
      }
    }

    const newHospital = new Hospital(data)
    const hospital = await newHospital.save()

    return NextResponse.json(hospital, { status: 201 })
  } catch (error) {
    console.error("Error creating hospital:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


import connectDB from "@/app/utils/db"
import Ambulance from "@/models/Ambulance"
import Hospital from "@/models/Hospital"

export async function GET(request) {
  await connectDB()

  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get("hospitalId")

    if (!hospitalId) {
      return new Response(JSON.stringify({ error: "Hospital ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Fetch hospital location
    const hospital = await Hospital.findById(hospitalId)
    if (!hospital) {
      return new Response(JSON.stringify({ error: "Hospital not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Fetch ambulances within 10 km radius
    const ambulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: hospital.location.coordinates,
          },
          $maxDistance: 10000, // 10 km in meters
        },
      },
      status: "online",
    })

    return new Response(JSON.stringify({ ambulances }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching ambulances:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch ambulances" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}


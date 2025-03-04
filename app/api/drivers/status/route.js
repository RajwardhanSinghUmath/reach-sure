import connectDB from "@/app/utils/db"
import Driver from "@/models/Driver"
import { NextResponse } from "next/server"

export async function PATCH(request) {
  await connectDB()

  try {
    const { phone, status } = await request.json()

    if (!phone || !status) {
      return NextResponse.json({ error: "Phone and status are required" }, { status: 400 })
    }

    const driver = await Driver.findOneAndUpdate({ phone }, { status }, { new: true })

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    return NextResponse.json(driver)
  } catch (error) {
    console.error("Error updating driver status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


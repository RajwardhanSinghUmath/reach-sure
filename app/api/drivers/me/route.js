import connectDB from "@/app/utils/db"
import Driver from "@/models/Driver"
import { NextResponse } from "next/server"

export async function GET(request) {
  await connectDB()

  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const driver = await Driver.findOne({ phone })
    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    return NextResponse.json(driver)
  } catch (error) {
    console.error("Error fetching driver:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


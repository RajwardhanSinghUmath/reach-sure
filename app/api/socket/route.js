import { Server } from "socket.io"
import { NextResponse } from "next/server"

// Global variable to store the Socket.io server instance
let io

export async function GET(req) {
  if (!io) {
    // Create a new Socket.io server if one doesn't exist
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    // Socket.io event handlers
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join a room based on user type (driver or user)
      socket.on("join", ({ type, id }) => {
        socket.join(`${type}_${id}`)
        console.log(`${type} with ID ${id} joined`)

        // If driver joins, also add them to the general driver room
        if (type === "driver") {
          socket.join("driver_room")
        }
      })

      // Handle new booking
      socket.on("newBooking", (bookingData) => {
        console.log("New booking received:", bookingData)
        // Broadcast to all drivers
        io.to("driver_room").emit("bookingAlert", bookingData)
        socket.broadcast.emit("bookingAlert", bookingData)
      })

      // Handle driver acceptance
      socket.on("acceptBooking", ({ bookingId, driverId, driverDetails }) => {
        console.log("Driver accepted booking:", { bookingId, driverId })
        // Notify the user that a driver accepted
        io.to(`user_${bookingId}`).emit("driverAccepted", {
          bookingId,
          driverId,
          driverDetails,
        })

        // Also broadcast to a general channel for testing
        io.emit("driverAccepted", {
          bookingId,
          driverId,
          driverDetails,
        })
      })

      // Handle driver location updates
      socket.on("updateLocation", ({ driverId, bookingId, location }) => {
        // Broadcast to specific booking user
        if (bookingId) {
          io.to(`user_${bookingId}`).emit("driverLocation", {
            driverId,
            location,
          })
        }
      })

      // Handle booking status updates
      socket.on("updateBookingStatus", ({ bookingId, status }) => {
        io.to(`user_${bookingId}`).emit("bookingStatusUpdate", { status })
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return new NextResponse("Socket.io server is running", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}


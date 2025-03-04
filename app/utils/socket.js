"use client"

import { io } from "socket.io-client"
import { useEffect, useState } from "react"

// Socket.io instance
let socket

export const initializeSocket = () => {
  // Use the same origin for socket connection to avoid CORS issues
  // This will connect to /api/socket on the same server
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin

  if (!socket) {
    socket = io(SOCKET_URL, {
      path: "/api/socket",
      reconnection: true, // Automatically reconnect on disconnect
      reconnectionAttempts: 5, // Try 5 times before giving up
      reconnectionDelay: 1000, // Wait 1 second before reconnecting
    })

    socket.on("connect", () => console.log("Connected to socket server"))

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason)
      if (reason === "io server disconnect") {
        socket.connect() // Reconnect if the server forcefully disconnects
      }
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })
  }

  return socket
}

// Hook for socket.io instance
export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const socket = initializeSocket()
      setSocketInstance(socket)

      return () => {
        // Don't disconnect on component unmount to maintain connection
        // Just clean up event listeners if needed
      }
    }
  }, [])

  return socketInstance
}

// Join a specific room (user or driver)
export const joinRoom = (socket, type, id) => {
  if (socket && id) {
    socket.emit("join", { type, id })
  }
}

// Listen for new bookings (driver side)
export const useBookingAlerts = (socket, setBookings) => {
  useEffect(() => {
    if (!socket) return

    const handleBookingAlert = (bookingData) => {
      console.log("New booking received:", bookingData)
      setBookings((prev) => [...prev, bookingData])
    }

    socket.on("bookingAlert", handleBookingAlert)

    return () => {
      socket.off("bookingAlert", handleBookingAlert)
    }
  }, [socket, setBookings])
}

// Listen for driver acceptance (user side)
export const useDriverAcceptance = (socket, bookingId, callback) => {
  useEffect(() => {
    if (!socket || !bookingId) return

    const handleDriverAcceptance = (data) => {
      if (callback) callback(data)
    }

    socket.on(`bookingAccepted_${bookingId}`, handleDriverAcceptance)
    socket.on("driverAccepted", handleDriverAcceptance) // Listen to general channel too

    return () => {
      socket.off(`bookingAccepted_${bookingId}`, handleDriverAcceptance)
      socket.off("driverAccepted", handleDriverAcceptance)
    }
  }, [socket, bookingId, callback])
}

// Listen for driver location updates (user side)
export const useDriverLocation = (socket, bookingId, callback) => {
  useEffect(() => {
    if (!socket || !bookingId) return

    const handleDriverLocationUpdate = (locationData) => {
      if (callback) callback(locationData)
    }

    socket.on(`driverLocation_${bookingId}`, handleDriverLocationUpdate)

    return () => {
      socket.off(`driverLocation_${bookingId}`, handleDriverLocationUpdate)
    }
  }, [socket, bookingId, callback])
}

// Listen for booking status updates (user side)
export const useBookingStatus = (socket, bookingId, callback) => {
  useEffect(() => {
    if (!socket || !bookingId) return

    const handleBookingStatusUpdate = (statusData) => {
      if (callback) callback(statusData)
    }

    socket.on(`bookingStatusUpdate_${bookingId}`, handleBookingStatusUpdate)

    return () => {
      socket.off(`bookingStatusUpdate_${bookingId}`, handleBookingStatusUpdate)
    }
  }, [socket, bookingId, callback])
}

export default {
  initializeSocket,
  useSocket,
  joinRoom,
  useBookingAlerts,
  useDriverAcceptance,
  useDriverLocation,
  useBookingStatus,
}


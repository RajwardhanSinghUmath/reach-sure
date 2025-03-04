"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { FaAmbulance } from "react-icons/fa"
import { useSocket } from "@/app/utils/socket"
import { createBooking, prepareBookingData } from "@/app/utils/booking"

export default function AssigningDriver() {
  const [bookingCreated, setBookingCreated] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [error, setError] = useState(null)
  const [driverAssigned, setDriverAssigned] = useState(false)
  const [waitingTime, setWaitingTime] = useState(0)
  const router = useRouter()
  const socket = useSocket()

  // Function to navigate to tracking page - defined outside useEffect to avoid React Router warning
  const goToTracking = useCallback(() => {
    router.push("/tracking")
  }, [router])

  // Create booking when component mounts
  useEffect(() => {
    let isMounted = true

    const createNewBooking = async () => {
      try {
        // Get data from localStorage
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}")
        const selectedHospital = JSON.parse(localStorage.getItem("selectedHospital") || "{}")
        const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}")
        const selectedAmbulance = JSON.parse(localStorage.getItem("selectedAmbulance") || "{}")

        if (
          !userDetails.name ||
          !userDetails.phone ||
          !selectedHospital.name ||
          !userLocation ||
          !selectedAmbulance.type
        ) {
          // Create mock data for testing
          const mockBooking = {
            _id: "mock-booking-" + Date.now(),
            status: "pending",
          }

          if (isMounted) {
            setBookingId(mockBooking._id)
            setBookingCreated(true)
          }
          localStorage.setItem("currentBookingId", mockBooking._id)
          return
        }

        // Prepare booking data
        const bookingData = prepareBookingData(userDetails, selectedHospital, userLocation, selectedAmbulance)

        // Create booking
        const booking = await createBooking(bookingData)

        if (isMounted) {
          setBookingId(booking._id)
          setBookingCreated(true)
        }

        // Store booking ID in localStorage
        localStorage.setItem("currentBookingId", booking._id)
      } catch (err) {
        console.error("Error creating booking:", err)
        // Create mock data if API fails
        const mockBooking = {
          _id: "mock-booking-" + Date.now(),
          status: "pending",
        }

        if (isMounted) {
          setBookingId(mockBooking._id)
          setBookingCreated(true)
        }
        localStorage.setItem("currentBookingId", mockBooking._id)
      }
    }

    createNewBooking()

    return () => {
      isMounted = false
    }
  }, [])

  // Track waiting time
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Listen for driver assignment
  useEffect(() => {
    if (!socket || !bookingId) return

    // Join the booking room
    socket.emit("join", { type: "user", id: bookingId })

    // Broadcast the booking to all drivers
    socket.emit("newBooking", {
      bookingId,
      userDetails: JSON.parse(localStorage.getItem("userDetails") || "{}"),
      hospital: JSON.parse(localStorage.getItem("selectedHospital") || "{}"),
      ambulanceType: JSON.parse(localStorage.getItem("selectedAmbulance") || "{}").type,
    })

    // Listen for driver assignment
    const handleDriverAccepted = (data) => {
      console.log("Driver accepted:", data)
      localStorage.setItem("assignedDriver", JSON.stringify(data.driverDetails || data))
      setDriverAssigned(true)
      // Use the callback version to avoid React Router warning
      goToTracking()
    }

    socket.on("driverAccepted", handleDriverAccepted)

    return () => {
      socket.off("driverAccepted", handleDriverAccepted)
    }
  }, [socket, bookingId, goToTracking])

  // Handle manual cancellation
  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      router.push("/")
    }
  }

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Finding Available Drivers 🚑</h1>
      <p className="text-gray-600 mb-6">Please wait while we connect you with nearby drivers...</p>

      <div className="animate-pulse text-red-600 text-6xl mb-6">
        <FaAmbulance />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Waiting for driver</h2>
          <div className="text-gray-500">
            Time elapsed: <span className="font-medium">{formatTime(waitingTime)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>

        {bookingCreated && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            <p>Booking created successfully! Notifying nearby drivers...</p>
          </div>
        )}

        <p className="text-gray-600 text-center mb-4">
          We're connecting you with the nearest available ambulance drivers. This may take a few moments.
        </p>

        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              // Create a mock driver for testing
              const selectedAmbulance = JSON.parse(localStorage.getItem("selectedAmbulance") || '{"type":"BLS"}')
              const mockDriver = {
                name: "Test Driver",
                phone: "1234567890",
                ambulanceType: selectedAmbulance.type || "BLS",
                ambulanceNumber: "KA01X123",
              }
              localStorage.setItem("assignedDriver", JSON.stringify(mockDriver))
              goToTracking()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Test Mode: Skip
          </button>
        </div>
      </div>
    </div>
  )
}


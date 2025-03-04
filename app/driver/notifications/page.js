"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "../../utils/socket"
import { FaAmbulance, FaPhone, FaMapMarkerAlt, FaCheck, FaTimes } from "react-icons/fa"

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const socket = useSocket()
  const router = useRouter()

  useEffect(() => {
    // Set a timeout to simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!socket) return

    // Join the driver room
    socket.emit("join", { type: "driver", id: "room" })

    // Listen for new bookings
    const handleNewBooking = (booking) => {
      console.log("New booking received:", booking)
      // Add the new booking to the notifications list with a timestamp
      setNotifications((prev) => [
        {
          ...booking,
          receivedAt: new Date(),
          id: booking.bookingId || `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
        ...prev,
      ])
    }

    socket.on("newBooking", handleNewBooking)
    socket.on("bookingAlert", handleNewBooking)

    // For testing, create a mock booking after 3 seconds if no bookings received
    const mockTimer = setTimeout(() => {
      if (notifications.length === 0) {
        const mockBooking = {
          bookingId: `mock-${Date.now()}`,
          userDetails: {
            name: "John Doe",
            phone: "9876543210",
          },
          hospital: {
            name: "City Hospital",
            location: {
              coordinates: [78.486, 17.385],
            },
          },
          ambulanceType: "BLS",
          receivedAt: new Date(),
          id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
        setNotifications([mockBooking])
      }
    }, 3000)

    return () => {
      socket.off("newBooking", handleNewBooking)
      socket.off("bookingAlert", handleNewBooking)
      clearTimeout(mockTimer)
    }
  }, [socket, notifications.length])

  const handleAcceptBooking = (booking) => {
    if (!socket) return

    // Get driver details from localStorage or create mock data
    const driverDetails = {
      name: "Test Driver",
      phone: "1234567890",
      ambulanceType: booking.ambulanceType || "BLS",
      ambulanceNumber: "KA01X123",
    }

    // Emit driver acceptance event
    socket.emit("acceptBooking", {
      bookingId: booking.bookingId,
      driverId: "driver-1", // Replace with actual driver ID
      driverDetails,
    })

    // Remove the booking from notifications
    setNotifications((prev) => prev.filter((n) => n.id !== booking.id))

    // Show confirmation
    alert("Booking accepted! You can now contact the patient.")

    // Redirect to dashboard
    router.push("/driver/dashboard")
  }

  const handleRejectBooking = (bookingId) => {
    // Remove the booking from notifications
    setNotifications((prev) => prev.filter((n) => n.id !== bookingId))
  }

  const formatTime = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Booking Notifications</h1>

      {notifications.length === 0 ? (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
          <FaAmbulance className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No new booking requests</p>
          <p className="text-gray-400 text-sm mt-2">New booking requests will appear here</p>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-bold text-lg">New Booking Request</h2>
                  <p className="text-gray-500 text-sm">{formatTime(notification.receivedAt)}</p>
                </div>
                <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {notification.ambulanceType || "BLS"}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Patient:</span>
                  <span>{notification.userDetails?.name || notification.userName || "Anonymous"}</span>
                </div>

                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-2" />
                  <a
                    href={`tel:${notification.userDetails?.phone || notification.userPhone || "1234567890"}`}
                    className="text-blue-600 hover:underline"
                  >
                    {notification.userDetails?.phone || notification.userPhone || "1234567890"}
                  </a>
                </div>

                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-500 mr-2 mt-1" />
                  <span>{notification.hospital?.name || "Unknown Hospital"}</span>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleRejectBooking(notification.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <FaTimes />
                  <span>Decline</span>
                </button>
                <button
                  onClick={() => handleAcceptBooking(notification)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaCheck />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


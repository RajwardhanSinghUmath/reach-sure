"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaPhone, FaToggleOn, FaToggleOff } from "react-icons/fa"

export default function Dashboard() {
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookings, setBookings] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        // For demo purposes, create a mock driver if API fails
        try {
          const response = await fetch("/api/drivers/me")
          if (response.ok) {
            const data = await response.json()
            setDriver(data)
          } else {
            throw new Error("Failed to fetch driver details")
          }
        } catch (err) {
          // Create mock driver data
          setDriver({
            name: "Demo Driver",
            phone: "9876543210",
            ambulanceType: "BLS",
            status: "online",
            ambulanceNumber: "KA01X123",
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Fetch mock bookings
    const fetchBookings = () => {
      setBookings([
        {
          id: "booking1",
          userName: "John Doe",
          userPhone: "1234567890",
          hospital: { name: "City Hospital" },
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          id: "booking2",
          userName: "Jane Smith",
          userPhone: "9876543210",
          hospital: { name: "General Hospital" },
          status: "accepted",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
    }

    fetchDriver()
    fetchBookings()
  }, [])

  const handleStatusChange = async (status) => {
    try {
      setDriver({ ...driver, status })

      // Try to update via API
      try {
        const response = await fetch("/api/drivers/status", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          throw new Error("Failed to update status")
        }

        const data = await response.json()
        setDriver(data)
      } catch (err) {
        // Just use the local state update if API fails
        console.error("API error:", err)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <p className="text-gray-500 text-center mt-20">Loading...</p>
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Driver Dashboard</h1>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome, {driver?.name}</h2>
        <p className="text-gray-600">Phone: {driver?.phone}</p>
        <p className="text-gray-600">Ambulance Type: {driver?.ambulanceType}</p>
        <p className="text-gray-600">Ambulance Number: {driver?.ambulanceNumber}</p>
        <p className="text-gray-600 flex items-center">
          Status:
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              driver?.status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {driver?.status === "online" ? "Online" : "Offline"}
          </span>
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleStatusChange("online")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all ${
              driver?.status === "online" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            <FaToggleOn className={driver?.status === "online" ? "opacity-100" : "opacity-50"} />
            Go Online
          </button>
          <button
            onClick={() => handleStatusChange("offline")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all ${
              driver?.status === "offline" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-red-100"
            }`}
          >
            <FaToggleOff className={driver?.status === "offline" ? "opacity-100" : "opacity-50"} />
            Go Offline
          </button>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500 bg-white p-4 rounded-lg shadow-md">No bookings available</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.userName}</h3>
                    <p className="text-sm text-gray-600">Hospital: {booking.hospital.name}</p>
                    <p className="text-sm text-gray-600">
                      Status:
                      <span
                        className={`ml-1 ${
                          booking.status === "pending"
                            ? "text-yellow-600"
                            : booking.status === "accepted"
                              ? "text-green-600"
                              : "text-gray-600"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </p>
                  </div>

                  <a
                    href={`tel:${booking.userPhone}`}
                    className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    <FaPhone size={12} />
                    {booking.userPhone}
                  </a>
                </div>

                <div className="mt-2 flex justify-end">
                  <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


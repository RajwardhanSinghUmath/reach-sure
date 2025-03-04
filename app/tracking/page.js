"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaAmbulance, FaPhone, FaUser, FaMapMarkerAlt, FaHospital } from "react-icons/fa"
import { useSocket } from "../utils/socket"
import dynamic from "next/dynamic"

// Import MapComponent dynamically with no SSR to avoid Leaflet issues
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => <div className="w-full h-60 bg-gray-200 flex items-center justify-center">Loading map...</div>,
})

export default function TrackingPage() {
  const [driver, setDriver] = useState(null)
  const [hospital, setHospital] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [distance, setDistance] = useState(5.2) // Distance in km
  const [status, setStatus] = useState("accepted") // pending, accepted, arrived, completed
  const router = useRouter()
  const socket = useSocket()

  useEffect(() => {
    // Load data from localStorage
    const assignedDriver = JSON.parse(localStorage.getItem("assignedDriver"))
    const selectedHospital = JSON.parse(localStorage.getItem("selectedHospital"))
    const userLocationData = JSON.parse(localStorage.getItem("userLocation"))
    const bookingId = localStorage.getItem("currentBookingId")

    if (!assignedDriver && !bookingId) {
      // If no driver is assigned and no booking ID, redirect to home
      alert("No active booking found. Redirecting to home page.")
      router.push("/")
      return
    }

    if (!assignedDriver) {
      // If no driver is assigned yet, create a mock driver for testing
      setDriver({
        name: "Test Driver",
        phone: "1234567890",
        ambulanceType: "BLS",
        ambulanceNumber: "KA01X123",
      })
    } else {
      setDriver(assignedDriver)
    }

    if (selectedHospital) {
      setHospital(selectedHospital)
    }

    if (userLocationData) {
      setUserLocation(userLocationData)
    }

    // Simulate distance updates
    const interval = setInterval(() => {
      setDistance((prevDistance) => {
        const newDistance = prevDistance - 0.1
        if (newDistance <= 0) {
          clearInterval(interval)
          setStatus("arrived")
          return 0
        }
        return newDistance
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    if (!socket) return

    // Get booking ID from localStorage
    const bookingId = localStorage.getItem("currentBookingId")

    if (bookingId) {
      // Join the booking room
      socket.emit("join", { type: "user", id: bookingId })

      // Listen for driver location updates
      socket.on("driverLocation", (locationData) => {
        console.log("Driver location updated:", locationData)
        // Update the map with the new location
      })

      // Listen for booking status updates
      socket.on("bookingStatusUpdate", (statusData) => {
        console.log("Booking status updated:", statusData)
        setStatus(statusData.status)

        if (statusData.status === "arrived") {
          alert("Your ambulance has arrived!")
        } else if (statusData.status === "completed") {
          alert("Your trip has been completed. Thank you for using ReachSure!")
          router.push("/")
        }
      })
    }

    return () => {
      if (bookingId) {
        socket.off("driverLocation")
        socket.off("bookingStatusUpdate")
      }
    }
  }, [socket, router])

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Finding a driver..."
      case "accepted":
        return "Driver is on the way"
      case "arrived":
        return "Driver has arrived"
      case "completed":
        return "Trip completed"
      default:
        return "Unknown status"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-red-600 mb-6 tracking-wide">
        {status === "arrived" ? "🚑 Ambulance Arrived!" : "🚑 Ambulance on the Way"}
      </h1>

      {/* Status Banner */}
      <div className={`w-full max-w-md mb-6 p-3 rounded-lg text-center font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </div>

      {/* Driver Details Card */}
      <div className="bg-white bg-opacity-90 shadow-lg backdrop-blur-md border border-gray-200 rounded-2xl p-6 w-full max-w-md mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Driver Details</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <FaUser size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{driver?.name}</p>
            <div className="flex items-center mt-1">
              <FaPhone className="text-gray-500 mr-1" size={14} />
              <a href={`tel:${driver?.phone}`} className="text-blue-600 hover:underline">
                {driver?.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <FaAmbulance className="text-red-600" />
          <p className="text-gray-700">
            <strong>Vehicle:</strong> {driver?.ambulanceType} ({driver?.ambulanceNumber})
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-gray-700 font-semibold text-lg">
              Distance: <span className="text-blue-600">{distance.toFixed(2)} km</span>
            </p>
          </div>
        </div>

        {/* Call Driver Button */}
        <a
          href={`tel:${driver?.phone}`}
          className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <FaPhone className="mr-2" /> Call Driver
        </a>
      </div>

      {/* Trip Details */}
      <div className="bg-white bg-opacity-90 shadow-lg backdrop-blur-md border border-gray-200 rounded-2xl p-6 w-full max-w-md mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Details</h2>

        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 mt-1">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="text-gray-800">Your Current Location</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3 mt-1">
              <FaHospital />
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="text-gray-800">{hospital?.name || "Selected Hospital"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-md h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-lg mb-6">
        {userLocation && hospital && (
          <MapComponent
            hospitals={[
              {
                id: hospital.id || "1",
                name: hospital.name,
                lat: hospital.location?.coordinates?.[1] || hospital.lat,
                lng: hospital.location?.coordinates?.[0] || hospital.lng,
                distance: distance,
              },
            ]}
            userLocation={{
              lat: userLocation.lat || userLocation.location?.coordinates?.[1],
              lng: userLocation.lng || userLocation.location?.coordinates?.[0],
            }}
            selectedHospital={{
              id: hospital.id || "1",
              name: hospital.name,
              lat: hospital.location?.coordinates?.[1] || hospital.lat,
              lng: hospital.location?.coordinates?.[0] || hospital.lng,
              distance: distance,
            }}
          />
        )}
      </div>

      {/* Emergency Contact Button */}
      <button
        className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center"
        onClick={() => alert("Emergency contact initiated!")}
      >
        <FaPhone className="mr-2" /> Emergency Contact
      </button>
    </div>
  )
}


"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { calculateCost } from "../utils/calculateCost"
import { FaAmbulance, FaHospital } from "react-icons/fa"

export default function SelectAmbulance() {
  const [ambulances, setAmbulances] = useState([
    {
      id: "bls",
      type: "BLS",
      description: "Basic Life Support",
      features: ["Basic medical equipment", "Trained driver", "Suitable for non-critical patients"],
      fixedPrice: 500,
      variablePrice: 20,
    },
    {
      id: "als-emt",
      type: "ALS - with EMT",
      description: "Advanced Life Support with EMT",
      features: ["Advanced medical equipment", "Emergency Medical Technician", "Critical care capabilities"],
      fixedPrice: 800,
      variablePrice: 30,
    },
    {
      id: "als",
      type: "ALS - without EMT",
      description: "Advanced Life Support",
      features: ["Advanced medical equipment", "Trained medical staff", "For serious conditions"],
      fixedPrice: 650,
      variablePrice: 25,
    },
  ])
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const hospital = localStorage.getItem("selectedHospital")
    if (!hospital) {
      alert("No hospital selected. Redirecting to homepage...")
      router.push("/")
      return
    }
    setSelectedHospital(JSON.parse(hospital))
    setLoading(false)
  }, [router])

  const handleAmbulanceSelect = async (ambulance) => {
    try {
      // Get hospital distance from localStorage
      const hospital = JSON.parse(localStorage.getItem("selectedHospital"))
      const distance = hospital.distance || 5 // Default to 5km if not available

      // Calculate cost based on distance and ambulance type
      const cost = calculateCost(distance, ambulance.type)

      // Save ambulance and cost in localStorage
      localStorage.setItem(
        "selectedAmbulance",
        JSON.stringify({
          ...ambulance,
          cost,
        }),
      )

      // Redirect to assigning-driver page
      router.push("/assigning-driver")
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Error: {error}</p>
          <button onClick={() => router.push("/")} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Select Ambulance Type</h1>
          <p className="text-gray-600">
            <FaHospital className="inline mr-2" />
            Destination: <span className="font-semibold">{selectedHospital?.name || "Selected Hospital"}</span>
          </p>
        </div>

        <div className="space-y-6">
          {ambulances.map((ambulance) => (
            <div
              key={ambulance.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <FaAmbulance className="text-red-600 mr-2" />
                      {ambulance.type}
                    </h2>
                    <p className="text-gray-600 mt-1">{ambulance.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">₹{ambulance.fixedPrice}</p>
                    <p className="text-sm text-gray-500">+₹{ambulance.variablePrice}/km</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Features:</h3>
                  <ul className="mt-2 space-y-1">
                    {ambulance.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleAmbulanceSelect(ambulance)}
                  className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <span>Select</span>
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


"use client"
import { createBooking as apiCreateBooking } from "./api"

export const prepareBookingData = (userDetails, selectedHospital, userLocation, ambulanceDetails) => {
  // Ensure coordinates are in the correct format for GeoJSON
  const hospitalCoordinates = selectedHospital.location?.coordinates || [selectedHospital.lng, selectedHospital.lat]

  const userCoordinates = userLocation.location?.coordinates || [userLocation.lng, userLocation.lat]

  return {
    userPhone: userDetails.phone,
    userName: userDetails.name,
    hospital: {
      name: selectedHospital.name,
      location: {
        type: "Point",
        coordinates: hospitalCoordinates,
      },
    },
    pickupLocation: {
      type: "Point",
      coordinates: userCoordinates,
    },
    ambulanceType: ambulanceDetails.type,
    distance: selectedHospital.distance || 5, // Default to 5km if not available
    cost: ambulanceDetails.cost,
    status: "pending",
  }
}

export const createBooking = async (bookingData) => {
  try {
    const response = await apiCreateBooking(bookingData)
    return response.booking
  } catch (error) {
    console.error("Error creating booking:", error)
    // Return a mock booking object if the API call fails
    return {
      _id: "mock-booking-" + Date.now(),
      status: "pending",
      ...bookingData,
    }
  }
}

export const getEstimatedArrivalTime = (distance) => {
  // Assuming average speed of 40 km/h in city traffic
  const averageSpeedKmh = 40
  // Convert distance to minutes: (distance in km / speed in km per hour) * 60 minutes
  const minutes = Math.ceil((distance / averageSpeedKmh) * 60)
  return minutes
}


"use client"

// Generic API call function
async function fetchApi(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
  }

  // Attach auth token if available (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  }

  try {
    const response = await fetch(endpoint, options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || `API Error: ${response.status} ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error.message)
    throw error
  }
}

// User-related API calls
export async function getUserBookings(phoneNumber) {
  if (!phoneNumber) throw new Error("Phone number is required")
  return fetchApi(`/api/bookings?userPhone=${encodeURIComponent(phoneNumber)}`)
}

// Booking-related API calls
export async function createBooking(bookingData) {
  return fetchApi("/api/bookings", "POST", bookingData)
}

export async function getBookingById(bookingId) {
  if (!bookingId) throw new Error("Booking ID is required")
  return fetchApi(`/api/bookings/${encodeURIComponent(bookingId)}`)
}

export async function updateBookingStatus(bookingId, status) {
  if (!bookingId || !status) throw new Error("Booking ID and status are required")
  return fetchApi(`/api/bookings/${encodeURIComponent(bookingId)}/status`, "PATCH", { status })
}

// Driver-related API calls
export async function onboardDriver(driverData) {
  return fetchApi("/api/drivers/onboard", "POST", driverData)
}

export async function updateDriverStatus(status) {
  if (!status) throw new Error("Status is required")
  return fetchApi("/api/drivers/status", "PATCH", { status })
}

export async function updateDriverLocation(lat, lng) {
  if (lat == null || lng == null) throw new Error("Latitude and longitude are required")
  return fetchApi("/api/drivers/location", "PATCH", { lat, lng })
}

export async function getNearbyHospitals(lat, lng, radius = 10000) {
  if (lat == null || lng == null) throw new Error("Latitude and longitude are required")
  return fetchApi(`/api/hospitals?lat=${lat}&lng=${lng}&radius=${radius}`)
}

export async function acceptBooking(bookingId) {
  if (!bookingId) throw new Error("Booking ID is required")
  return fetchApi(`/api/bookings/${encodeURIComponent(bookingId)}/accept`, "PATCH")
}

export default {
  getUserBookings,
  createBooking,
  getBookingById,
  updateBookingStatus,
  onboardDriver,
  updateDriverStatus,
  updateDriverLocation,
  getNearbyHospitals,
  acceptBooking,
}


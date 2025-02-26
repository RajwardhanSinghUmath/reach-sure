// File: app/utils/api.js
'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic API call function
async function fetchApi(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Attach auth token if available (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error.message);
    throw error;
  }
}

// Cost calculation utility
export async function calculateCost(distance, ambulanceType) {
  return fetchApi('/bookings/calculate-cost', 'POST', { distance, ambulanceType });
}

// User-related API calls
export async function sendOTP(phoneNumber) {
  return fetchApi('/users/send-otp', 'POST', { phoneNumber });
}

export async function verifyOTP(phoneNumber, otp) {
  return fetchApi('/users/verify-otp', 'POST', { phoneNumber, otp });
}

export async function getUserBookings(phoneNumber) {
  if (!phoneNumber) throw new Error('Phone number is required');
  return fetchApi(`/users/bookings/${encodeURIComponent(phoneNumber)}`);
}

// Booking-related API calls
export async function createBooking(bookingData) {
  return fetchApi('/bookings', 'POST', bookingData);
}

export async function getBookingById(bookingId) {
  if (!bookingId) throw new Error('Booking ID is required');
  return fetchApi(`/bookings/${encodeURIComponent(bookingId)}`);
}

export async function updateBookingStatus(bookingId, status) {
  if (!bookingId || !status) throw new Error('Booking ID and status are required');
  return fetchApi(`/bookings/${encodeURIComponent(bookingId)}/status`, 'PATCH', { status });
}

// Driver-related API calls
export async function onboardDriver(driverData) {
  return fetchApi('/drivers/onboard', 'POST', driverData);
}

export async function updateDriverStatus(driverId, status) {
  if (!driverId || !status) throw new Error('Driver ID and status are required');
  return fetchApi(`/drivers/${encodeURIComponent(driverId)}/status`, 'PATCH', { status });
}

export async function updateDriverLocation(driverId, lat, lng) {
  if (!driverId || lat == null || lng == null) throw new Error('Driver ID, latitude, and longitude are required');
  return fetchApi(`/drivers/${encodeURIComponent(driverId)}/location`, 'PATCH', { lat, lng });
}

export async function getNearbyDrivers(lat, lng, radius = 15) {
  if (lat == null || lng == null) throw new Error('Latitude and longitude are required');
  return fetchApi(`/drivers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
}

export async function acceptBooking(bookingId, driverId) {
  if (!bookingId || !driverId) throw new Error('Booking ID and Driver ID are required');
  return fetchApi(`/bookings/${encodeURIComponent(bookingId)}/accept`, 'PATCH', { driverId });
}
export async function fetchDriverRequests() {
  return fetchApi('/drivers/requests'); // Update the endpoint as per your backend API
}
export async function updateRideStatus(rideId, status) {
  if (!rideId || !status) throw new Error('Ride ID and status are required');
  return fetchApi(`/rides/${encodeURIComponent(rideId)}/status`, 'PATCH', { status });
}


export default {
  fetchDriverRequests,
  calculateCost,
  sendOTP,
  verifyOTP,
  getUserBookings,
  createBooking,
  getBookingById,
  updateBookingStatus,
  onboardDriver,
  updateDriverStatus,
  updateDriverLocation,
  getNearbyDrivers,
  acceptBooking,
};

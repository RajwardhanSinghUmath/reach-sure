// utils/booking.js - A new file to handle booking-related functions

export const prepareBookingData = (userDetails, selectedHospital, userLocation, ambulanceDetails) => {
    return {
      userPhone: userDetails.phone,
      userName: userDetails.name,
      hospital: {
        name: selectedHospital.name,
        location: {
          type: 'Point',
          coordinates: [selectedHospital.lng, selectedHospital.lat] // Note: GeoJSON uses [longitude, latitude]
        }
      },
      pickupLocation: {
        type: 'Point',
        coordinates: [userLocation.lng, userLocation.lat] // Note: GeoJSON uses [longitude, latitude]
      },
      ambulanceType: ambulanceDetails.type,
      distance: selectedHospital.distance,
      cost: ambulanceDetails.cost,
      status: 'pending'
    };
  };
  
  export const createBooking = async (bookingData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };
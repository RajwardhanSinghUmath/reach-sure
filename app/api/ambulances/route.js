import connectDB from '@/app/utils/db'; // Correct import path
import Ambulance from '@/models/Ambulance';
import Hospital from '@/models/Hospital'; // Ensure Hospital model is imported

export async function GET(request) {
  await connectDB(); // Ensure MongoDB connection

  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');

    if (!hospitalId) {
      return new Response(JSON.stringify({ error: 'Hospital ID is required' }), {
        status: 400,
      });
    }

    // Fetch hospital location
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return new Response(JSON.stringify({ error: 'Hospital not found' }), {
        status: 404,
      });
    }

    // Fetch ambulances within 10 km radius
    const ambulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: hospital.location.coordinates, // [longitude, latitude]
          },
          $maxDistance: 10000, // 10 km in meters
        },
      },
      status: 'online', // Only fetch online ambulances
    });

    return new Response(JSON.stringify({ ambulances }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching ambulances:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch ambulances' }), {
      status: 500,
    });
  }
}
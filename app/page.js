'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOTP } from './utils/api';
import dynamic from 'next/dynamic';

// Import MapComponent dynamically with no SSR to avoid Leaflet issues
const MapComponent = dynamic(() => import('./components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-60 bg-gray-200 flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load saved user details from localStorage on component mount
  useEffect(() => {
    const savedUserDetails = localStorage.getItem('userDetails');
    if (savedUserDetails) {
      const { name: savedName, phone: savedPhone } = JSON.parse(savedUserDetails);
      setName(savedName || '');
      setPhone(savedPhone || '');
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      try {
        // Fetch nearby hospitals using Overpass API
        setIsLoading(true);
        const fetchedHospitals = await fetchHospitalsFromOverpass(latitude, longitude);
        
        // Sort hospitals by distance (nearest first)
        const sortedHospitals = fetchedHospitals.sort((a, b) => a.distance - b.distance);
        setHospitals(sortedHospitals);
        
        // Auto-select the nearest hospital
        if (sortedHospitals.length > 0) {
          setSelectedHospital(sortedHospitals[0]);
        }
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        alert('Failed to fetch nearby hospitals. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Geolocation error:', error);
      alert('Unable to get your location. Please allow location access.');
      setIsLoading(false);
    });
  }, []);

  // console.log(lat, lng);
  const fetchHospitalsFromOverpass = async (lat, lng) => {
    // Define the search radius (in meters)
    const radius = 10000; // 10km

    // Create a Overpass API query for hospitals
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
      );
      out center;
    `;

    // Make the request to Overpass API
    const response = await fetch(`https://overpass-api.de/api/interpreter`, {
      method: 'POST',
      body: overpassQuery
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nearby hospitals');
    }

    const data = await response.json();
    
    // Process the data to extract hospital information
    return data.elements.map(element => {
      // Get coordinates based on element type
      let hospitalLat, hospitalLng;
      
      if (element.type === 'node') {
        hospitalLat = element.lat;
        hospitalLng = element.lon;
      } else {
        // For ways and relations, use the center coordinates
        hospitalLat = element.center.lat;
        hospitalLng = element.center.lon;
      }

      // Calculate distance
      const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);
      
      return {
        id: element.id.toString(),
        name: element.tags.name || `Hospital #${element.id}`,
        distance: distance,
        lat: hospitalLat,
        lng: hospitalLng,
        address: element.tags.address || element.tags['addr:full'] || 'Address not available'
      };
    });
  };

  // Haversine formula to calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

 // Update to the handleProceed function in your Home component

const handleProceed = async () => {
  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  if (!selectedHospital) {
    alert('Please select a hospital.');
    return;
  }

  try {
    // Format userLocation to match GeoJSON format expected by MongoDB
    const formattedUserLocation = {
      ...userLocation,
      type: 'Point',
      coordinates: [userLocation.lng, userLocation.lat]
    };

    // Format hospital data to match your schema
    const formattedHospital = {
      name: selectedHospital.name,
      location: {
        type: 'Point',
        coordinates: [selectedHospital.lng, selectedHospital.lat]
      }
    };

    // Save properly formatted data in localStorage
    localStorage.setItem('userDetails', JSON.stringify({ name, phone }));
    localStorage.setItem('selectedHospital', JSON.stringify(formattedHospital));
    localStorage.setItem('userLocation', JSON.stringify(formattedUserLocation));

    // Send OTP for verification
    // await sendOTP(phone);

    // Redirect to select-ambulance page
    router.push('/select-ambulance');
  } catch (error) {
    console.error('Error sending OTP:', error);
    alert('Failed to send verification code. Please try again.');
  }
};

  const handleMapSelection = (hospital) => {
    setSelectedHospital(hospital);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-8">🚑 Ambulance Service</h1>

      <div className="w-full max-w-md bg-gray-100 shadow-md rounded-lg p-4 mb-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md h-60 mb-4">
        {userLocation && (
          <MapComponent 
            hospitals={hospitals} 
            userLocation={userLocation} 
            selectedHospital={selectedHospital} 
            onHospitalSelect={handleMapSelection}
          />
        )}
      </div>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">🏥 Select Hospital</h2>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : hospitals.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hospitals found nearby</p>
        ) : (
          <div className="max-h-40 overflow-y-auto">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className={`p-2 cursor-pointer border-b flex justify-between items-center ${
                  selectedHospital?.id === hospital.id ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                <div>
                  <div>{hospital.name}</div>
                  <div className="text-xs text-gray-500">{hospital.address}</div>
                </div>
                <span className="text-sm text-gray-600">
                  {hospital.distance.toFixed(1)} km
                  {hospital === hospitals[0] && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Nearest</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={handleProceed}
          disabled={isLoading || !selectedHospital}
          className={`w-full mt-4 px-6 py-2 rounded-lg shadow-md transition-all ${
            isLoading || !selectedHospital
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}
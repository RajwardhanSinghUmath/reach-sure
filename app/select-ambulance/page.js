'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateCost } from '../utils/api.js';


export default function SelectAmbulance() {
  const [ambulances, setAmbulances] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const hospital = JSON.parse(localStorage.getItem('selectedHospital'));
    if (!hospital) {
      alert('No hospital selected. Redirecting to homepage...');
      router.push('/');
      return;
    }
    setSelectedHospital(hospital);

    // Fetch available ambulances within 10 km radius
    const fetchAmbulances = async () => {
      try {
        const response = await fetch(`/api/ambulances?hospitalId=${hospital.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch ambulances');
        }
        const data = await response.json();
        setAmbulances(data.ambulances);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAmbulances();
  }, []);

  const handleAmbulanceSelect = async (ambulance) => {
    try {
      // Calculate cost based on distance and ambulance type
      const cost = await calculateCost(selectedHospital.distance, ambulance.type);

      // Save ambulance and cost in localStorage
      localStorage.setItem('selectedAmbulance', JSON.stringify(ambulance));
      localStorage.setItem('cost', JSON.stringify(cost));

      // Redirect to assigning-driver page
      router.push('/assigning-driver');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">
        Available Ambulances near {selectedHospital?.name || 'your location'}
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading ambulances...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : ambulances.length === 0 ? (
        <p className="text-gray-500">No ambulances available.</p>
      ) : (
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
          {ambulances.map((ambulance) => (
            <button
              key={ambulance._id} // Use MongoDB _id as the key
              className="w-full flex justify-between items-center bg-red-500 text-white px-5 py-4 rounded-lg shadow-md hover:bg-red-600 transition-all my-3"
              onClick={() => handleAmbulanceSelect(ambulance)}
            >
              <div className="text-left">
                <span className="font-bold text-lg">{ambulance.type}</span>
                <p className="text-sm opacity-90">{ambulance.service}</p>
              </div>
              <span className="font-bold text-lg">₹{ambulance.fixedPrice}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
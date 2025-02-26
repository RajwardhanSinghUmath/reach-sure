'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MapComponent from '@/components/MapComponent';
import { useSocket } from '@/utils/socket';

export default function TrackingPage() {
  const [driver, setDriver] = useState(null);
  const [eta, setEta] = useState(8 * 60); // ETA in seconds
  const [distance, setDistance] = useState(5.2); // Distance in km
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    const assignedDriver = JSON.parse(localStorage.getItem('assignedDriver'));
    if (!assignedDriver) {
      alert('No driver assigned. Redirecting to homepage...');
      router.push('/');
      return;
    }
    setDriver(assignedDriver);

    const interval = setInterval(() => {
      setEta((prevEta) => (prevEta > 0 ? prevEta - 1 : 0));
      setDistance((prevDistance) => (prevDistance > 0 ? prevDistance - (5.2 / (8 * 60)) : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    // Listen for driver location updates
    socket.on('driverLocation', (location) => {
      console.log('Driver location updated:', location);
      // Update the map with the new location
    });

    return () => {
      socket.off('driverLocation');
    };
  }, [socket]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-red-600 mb-6 tracking-wide animate-pulse">
        🚑 Ambulance on the Way
      </h1>

      {/* Driver Details Card */}
      <div className="bg-white bg-opacity-90 shadow-lg backdrop-blur-md border border-gray-200 rounded-2xl p-6 w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Assigned Driver</h2>
        <p className="text-gray-600"><strong>Name:</strong> {driver?.name}</p>
        <p className="text-gray-600"><strong>Phone:</strong> {driver?.phone}</p>
        <p className="text-gray-600"><strong>Service:</strong> {driver?.service}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-gray-700 font-semibold text-lg">ETA: <span className="text-red-600">{formatTime(eta)}</span></p>
            <p className="text-gray-700 font-semibold text-lg">Distance: <span className="text-blue-600">{distance.toFixed(2)} km</span></p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-3 mt-3 relative">
          <div
            className="bg-red-600 h-3 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(eta / (8 * 60)) * 100}%` }}
          ></div>
          <span className="absolute top-1/2 transform -translate-y-1/2 right-2 text-xs font-semibold text-gray-700">{`${((eta / (8 * 60)) * 100).toFixed(0)}%`}</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-md h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-lg mt-6 transform transition-all duration-500 hover:scale-[1.02]">
        <MapComponent />
      </div>
    </div>
  );
}
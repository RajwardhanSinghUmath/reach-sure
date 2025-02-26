'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch('/api/drivers/me');
        if (!response.ok) {
          throw new Error('Failed to fetch driver details');
        }
        const data = await response.json();
        setDriver(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, []);

  const handleStatusChange = async (status) => {
    try {
      const response = await fetch('/api/drivers/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setDriver(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Driver Dashboard</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome, {driver?.name}</h2>
        <p className="text-gray-600">Phone: {driver?.phone}</p>
        <p className="text-gray-600">Ambulance Type: {driver?.ambulanceType}</p>
        <p className="text-gray-600">Status: {driver?.status}</p>

        <div className="mt-6">
          <button
            onClick={() => handleStatusChange('online')}
            className="w-full bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all mb-2"
          >
            Go Online
          </button>
          <button
            onClick={() => handleStatusChange('offline')}
            className="w-full bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Go Offline
          </button>
        </div>
      </div>
    </div>
  );
}
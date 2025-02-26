'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaAmbulance } from 'react-icons/fa';
import { useSocket } from '@/utils/socket';

export default function AssigningDriver() {
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      router.push('/tracking');
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    // Listen for driver assignment
    socket.on('driverAssigned', (driver) => {
      localStorage.setItem('assignedDriver', JSON.stringify(driver));
      router.push('/tracking');
    });

    return () => {
      socket.off('driverAssigned');
    };
  }, [socket, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Assigning a Driver 🚑
      </h1>
      <p className="text-gray-600 mb-6">Please wait while we assign an ambulance...</p>

      <div className="animate-bounce text-red-600 text-6xl mb-6">
        <FaAmbulance />
      </div>

      <p className="text-lg text-gray-700">
        Estimated Time: <span className="font-bold text-red-500">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}</span> seconds
      </p>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useSocket } from '../../utils/socket';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('newBooking', (booking) => {
        setNotifications((prev) => [...prev, booking]);
      });

      return () => {
        socket.off('newBooking');
      };
    }
  }, [socket]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Notifications</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="mb-4 p-4 border-b">
              <p className="text-gray-800">New Booking Request</p>
              <p className="text-gray-600">User: {notification.userName}</p>
              <p className="text-gray-600">Phone: {notification.userPhone}</p>
              <p className="text-gray-600">Hospital: {notification.hospital.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
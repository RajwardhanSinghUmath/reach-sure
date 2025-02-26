'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Map = ({ hospitals, userLocation }) => {
  const defaultCenter = [17.385, 78.486]; // Default center (Hyderabad)

  const hospitalIcon = L.divIcon({
    html: '🏥',
    className: 'text-2xl',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const userIcon = L.divIcon({
    html: '📍',
    className: 'text-2xl',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <MapContainer
      center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
      zoom={13}
      className="w-full h-full rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* User Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Your Location</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Hospital Markers */}
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.lat, hospital.lng]}
          icon={hospitalIcon}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{hospital.name}</p>
              <p className="text-sm text-gray-600">
                {hospital.distance.toFixed(1)} km away
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
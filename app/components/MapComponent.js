"use client"
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const MapComponent = ({ hospitals, userLocation, selectedHospital, onHospitalSelect }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    // Initialize map only if not already created
    if (!mapInstanceRef.current && mapRef.current && userLocation) {
      const defaultIcon = L.icon({
        iconUrl: "/marker-icon.png",
        iconRetinaUrl: "/marker-icon-2x.png",
        shadowUrl: "/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      // Set default icon for all markers
      L.Marker.prototype.options.icon = defaultIcon

      // Create map
      mapInstanceRef.current = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 14)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)

      // Add user marker
      const userIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your Location")
        .openPopup()
    }

    return () => {
      // Clean up the map on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [userLocation])

  // Update hospitals on the map
  useEffect(() => {
    if (!mapInstanceRef.current || !hospitals || hospitals.length === 0) return

    // Clear existing hospital markers
    Object.values(markersRef.current).forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = {}

    // Add hospital markers
    hospitals.forEach((hospital) => {
      const isSelected = selectedHospital && selectedHospital.id === hospital.id

      const hospitalIcon = L.divIcon({
        html: `<div class="w-6 h-6 flex items-center justify-center rounded-full ${isSelected ? "bg-red-500" : "bg-red-300"} text-white text-xs font-bold border-2 border-white shadow-md">H</div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${hospital.name}</b><br>${hospital.distance.toFixed(1)} km away`)
        .on("click", () => {
          if (onHospitalSelect) {
            onHospitalSelect(hospital)
          }
        })

      markersRef.current[hospital.id] = marker

      if (isSelected) {
        marker.openPopup()
      }
    })
  }, [hospitals, selectedHospital, onHospitalSelect])

  // Update selected hospital marker
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedHospital) return

    // Update all markers to reflect selection state
    hospitals.forEach((hospital) => {
      const marker = markersRef.current[hospital.id]
      if (marker) {
        const isSelected = selectedHospital.id === hospital.id

        const hospitalIcon = L.divIcon({
          html: `<div class="w-6 h-6 flex items-center justify-center rounded-full ${isSelected ? "bg-red-500" : "bg-red-300"} text-white text-xs font-bold border-2 border-white shadow-md">H</div>`,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        marker.setIcon(hospitalIcon)

        if (isSelected) {
          marker.openPopup()
          mapInstanceRef.current.panTo([hospital.lat, hospital.lng])
        }
      }
    })
  }, [selectedHospital, hospitals])

  return <div ref={mapRef} className="w-full h-full rounded-lg shadow-md z-0" />
}

export default MapComponent


"use client"
import { useState, useEffect } from "react"

export default function useLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    const successHandler = (position) => {
      const { latitude, longitude } = position.coords
      setLocation({
        lat: latitude,
        lng: longitude,
      })
      setLoading(false)
    }

    const errorHandler = (error) => {
      setError(error.message)
      setLoading(false)
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options)

    // For continuous tracking (optional)
    // const watchId = navigator.geolocation.watchPosition(
    //   successHandler,
    //   errorHandler,
    //   options
    // );

    // return () => navigator.geolocation.clearWatch(watchId);
  }, [])

  return { location, error, loading }
}


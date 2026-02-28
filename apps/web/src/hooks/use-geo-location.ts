import { env } from "@sync-station/env/web";
import { useEffect, useState } from "react";

// 1. Define the exact shape and types of your state
interface GeoLocationState {
  loading: boolean;
  lat: number | null;
  lon: number | null;
  error: string | null;
}

export function useGeoLocation() {
  // 2. Pass the interface to useState
  const [location, setLocation] = useState<GeoLocationState>({ 
    loading: true, 
    lat: null, 
    lon: null, 
    error: null 
  });

  useEffect(() => {
    async function getLocation() {
      try {
        const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${env.VITE_LOCATION_API}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}), // Sending empty body uses your IP for location
        });

        if (!res.ok) throw new Error("Google API error");

        const data = await res.json();
        setLocation({
          lat: data.location.lat,
          lon: data.location.lng,
          loading: false,
          error: null
        });
      } catch (err: any) {
        // Also updated this slightly to safely handle the error string
        setLocation((prev) => ({ 
          ...prev, 
          loading: false, 
          error: err.message || "Failed to fetch location" 
        }));
      }
    }
    getLocation();
  }, []);

  return location;
}
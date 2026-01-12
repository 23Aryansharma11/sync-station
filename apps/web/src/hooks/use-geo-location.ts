import { useEffect, useState } from "react";

type GeoLocationResponse = {
  city?: string;
  lat?: number;
  lon?: number;
};

export function useGeoLocation() {
  const [locationData, setLocationData] = useState<GeoLocationResponse | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  async function getLocation() {
    try {
      const res = await fetch("http://ip-api.com/json");

      if (!res.ok) {
        throw new Error("Failed to fetch location");
      }

      const data = await res.json();
      setLocationData(data);
    } catch (error) {
      console.error("GeoLocation fetch failed:", error);
    }
  }

  return {
    city: locationData?.city,
    lat: locationData?.lat,
    lon: locationData?.lon,
  };
}

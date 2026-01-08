import { useCallback, useEffect, useState } from "react";

type LocationPermission =
  | "granted"
  | "denied"
  | "prompt"
  | "unsupported";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type UseCurrentLocationReturn = {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permission: LocationPermission;
  supported: boolean;
  requestLocation: () => Promise<LocationData | null>;
};

export function useCurrentLocation(
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 0,
  }
): UseCurrentLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<LocationPermission>("prompt");

  const supported =
    typeof navigator !== "undefined" && !!navigator.geolocation;

  useEffect(() => {
    if (!supported) {
      setPermission("unsupported");
      return;
    }

    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((result) => {
        setPermission(result.state as LocationPermission);
      })
      .catch(() => {
        setPermission("prompt");
      });
  }, [supported]);

  const requestLocation = useCallback(() => {
    if (!supported) {
      setPermission("unsupported");
      setError("Geolocation not supported by this browser");
      return Promise.resolve(null);
    }

    setLoading(true);
    setError(null);

    return new Promise<LocationData | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setLocation(data);
          setPermission("granted");
          setLoading(false);
          resolve(data);
        },
        (err) => {
          setLoading(false);
          setError(err.message);

          if (err.code === err.PERMISSION_DENIED) {
            setPermission("denied");
          }

          resolve(null);
        },
        options
      );
    });
  }, [supported, options]);

  return {
    location,
    loading,
    error,
    permission,
    supported,
    requestLocation,
  };
}

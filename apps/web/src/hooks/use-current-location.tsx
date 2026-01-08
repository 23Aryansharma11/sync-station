import { useEffect, useState } from "react";

type LocationPermission =
    | "granted"
    | "denied"
    | "prompt"
    | "unsupported";

type LocationState = {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    loading: boolean;
    error: string | null;
    permission: LocationPermission;
};

export function useCurrentLocation(
    options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
    }
): LocationState {
    const [state, setState] = useState<LocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: true,
        error: null,
        permission: "prompt",
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                latitude: null,
                longitude: null,
                accuracy: null,
                loading: false,
                error: "Geolocation not supported",
                permission: "unsupported",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setState({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    loading: false,
                    error: null,
                    permission: "granted",
                });
            },
            (err) => {
                setState((s) => ({
                    ...s,
                    loading: false,
                    error: err.message,
                    permission:
                        err.code === err.PERMISSION_DENIED ? "denied" : s.permission,
                }));
            },
            options
        );
    }, [options]);

    return state;
}

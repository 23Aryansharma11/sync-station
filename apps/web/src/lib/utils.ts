import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export function isWithinDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  maxDistanceKm: number
): boolean {
  const R = 6371;
  const EPSILON = 1e-9; // Tolerance for floating-point errors

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Round inputs to avoid precision drift
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  // Add epsilon tolerance for identical coordinates
  return Math.abs(distanceKm) < EPSILON || distanceKm <= maxDistanceKm;
}


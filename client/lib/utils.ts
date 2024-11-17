import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchLocation(latitude: number, longitude: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing!");
  }

  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location data");
  }

  const data = await response.json();

  return data.results[0]?.formatted || "Unknown location";
}

// 2024-11-17T15:08:33.214Z to  17/11/2024, 21:09:26

export function formatDate(date: Date) {
  return new Date(date).toLocaleString();
}

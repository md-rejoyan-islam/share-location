import { GeolocationPosition } from "@/lib/types";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components with SSR: false
const MapWithNoSSR = dynamic(() => import("./map-with-ssr"), { ssr: false });

export default function Map({
  location,
}: {
  location: GeolocationPosition | null;
}) {
  return <MapWithNoSSR location={location} />;
}

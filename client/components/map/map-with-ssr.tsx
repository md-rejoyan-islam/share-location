import { GeolocationPosition } from "@/lib/types";
import { useEffect } from "react";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Default Marker Icon Configuration
const defaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
});

L.Marker.prototype.options.icon = defaultIcon;

function LocationMarker({
  location,
}: {
  location: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    if (typeof window !== "undefined") {
      map.flyTo([location.lat || 0, location.lng || 0], map.getZoom());
    }
  }, [location, map]);

  return (
    <Marker position={location} icon={defaultIcon}>
      <Popup>User is here!</Popup>
    </Marker>
  );
}

function MapWithSSR({ location }: { location: GeolocationPosition | null }) {
  if (!location?.lat || !location?.lng) {
    return <p>No location found</p>;
  } else {
    return (
      <div className="w-full h-full">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom
          className="h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker location={location} />
        </MapContainer>
      </div>
    );
  }
}

export default MapWithSSR;

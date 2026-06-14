import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
import { directionsUrl } from "@/lib/geocode";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  lat: number | null | undefined;
  lng: number | null | undefined;
  label?: string;
  height?: number;
}

export function LocationMap({ lat, lng, label, height = 220 }: Props) {
  if (lat == null || lng == null) return null;
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-2xl border border-border shadow-card" style={{ height }}>
        <MapContainer center={[lat, lng]} zoom={16} className="h-full w-full" scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={icon} />
        </MapContainer>
      </div>
      <a
        href={directionsUrl(lat, lng, label)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition-all active:scale-95"
      >
        <Navigation className="h-4 w-4" />
        Como chegar
      </a>
    </div>
  );
}

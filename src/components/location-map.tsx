import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin } from "lucide-react";
import { directionsUrl } from "@/lib/geocode";
import { renderToStaticMarkup } from "react-dom/server";

const markerHtml = renderToStaticMarkup(
  <div className="relative flex flex-col items-center">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/30">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>
    <div className="-mt-1 h-3 w-3 rotate-45 bg-primary shadow-md" />
  </div>,
);

const icon = L.divIcon({
  className: "!bg-transparent !border-0",
  html: markerHtml,
  iconSize: [40, 52],
  iconAnchor: [20, 50],
  popupAnchor: [0, -46],
});

interface Props {
  lat: number | null | undefined;
  lng: number | null | undefined;
  label?: string;
  height?: number;
}

export function LocationMap({ lat, lng, label, height = 260 }: Props) {
  if (lat == null || lng == null) return null;
  return (
    <div className="space-y-2">
      <div
        className="relative overflow-hidden rounded-2xl border border-border shadow-card"
        style={{ height }}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={17}
          className="h-full w-full"
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <Marker position={[lat, lng]} icon={icon}>
            {label ? (
              <Popup>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="font-medium">{label}</span>
                </div>
              </Popup>
            ) : null}
          </Marker>
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

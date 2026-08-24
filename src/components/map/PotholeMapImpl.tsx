import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { Link } from "@tanstack/react-router";
import type { Pothole } from "@/data/sadak";
import { severityLabel, statusLabel } from "@/data/sadak";

const sevColor: Record<string, string> = {
  critical: "#f4553d",
  high: "#f97b3d",
  medium: "#f5c045",
  low: "#4fd6c4",
};

export default function PotholeMapImpl({
  items,
  height = 520,
  center,
  zoom = 12,
}: {
  items: Pothole[];
  height?: number;
  center?: [number, number];
  zoom?: number;
}) {
  const mid: [number, number] = center ?? [18.5204, 73.8567];

  return (
    <MapContainer
      center={mid}
      zoom={zoom}
      scrollWheelZoom
      style={{ height, width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={p.severity === "critical" ? 12 : p.severity === "high" ? 10 : 8}
          pathOptions={{
            color: sevColor[p.severity]!,
            fillColor: sevColor[p.severity]!,
            fillOpacity: p.status === "resolved" ? 0.2 : 0.55,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            {p.code} · {severityLabel[p.severity]}
          </Tooltip>
          <Popup>
            <div style={{ minWidth: 190 }}>
              <strong>{p.code}</strong>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {p.road}, {p.area}
              </div>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {severityLabel[p.severity]} · {statusLabel[p.status]} · {p.repeatCount} detections
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
              </div>
              <Link
                to="/pothole/$id"
                params={{ id: p.id }}
                style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 600 }}
              >
                Open full profile →
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

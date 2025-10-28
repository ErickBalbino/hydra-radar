"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

type Props = {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
};

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x.src,
  iconUrl: marker1x.src,
  shadowUrl: markerShadow.src,
});

function ClickCatcher({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  const once = useRef(false);
  useEffect(() => {
    if (!once.current) {
      setTimeout(() => map.invalidateSize(), 50);
      once.current = true;
    }
  }, [map]);

  return null;
}

export default function MapPicker({ latitude, longitude, onChange }: Props) {
  const center: [number, number] = [latitude ?? -3.689, longitude ?? -40.35];

  return (
    <div className="h-80 w-full overflow-hidden rounded-md">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {latitude != null && longitude != null && (
          <Marker position={[latitude, longitude]} />
        )}
        <ClickCatcher onChange={onChange} />
      </MapContainer>
    </div>
  );
}

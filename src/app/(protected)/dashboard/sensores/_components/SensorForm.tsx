"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../../_components/map/MapPicker"), { ssr: false });

type SensorInput = {
  name: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  isPublic?: boolean;
};

type Sensor = {
  id: string;
  name: string;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  isPublic?: boolean;
};

export default function SensorForm({
  sensor,
  submitLabel,
  onSubmit,
}: {
  sensor?: Sensor;
  submitLabel: string;
  onSubmit: (data: Partial<SensorInput>) => Promise<void>;
}) {
  const [name, setName] = useState(sensor?.name ?? "");
  const [code, setCode] = useState(sensor?.code ?? "");
  const [latitude, setLatitude] = useState<number | undefined | null>(sensor?.latitude ?? undefined);
  const [longitude, setLongitude] = useState<number | undefined | null>(sensor?.longitude ?? undefined);
  const [isPublic, setIsPublic] = useState<boolean>(sensor?.isPublic ?? true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(sensor?.name ?? "");
    setCode(sensor?.code ?? "");
    setLatitude(sensor?.latitude ?? undefined);
    setLongitude(sensor?.longitude ?? undefined);
    setIsPublic(sensor?.isPublic ?? true);
  }, [sensor]);

  const disabled = useMemo(() => !name.trim() || !code.trim(), [name, code]);

  async function handleSubmit() {
    if (disabled) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        code: code.trim(),
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        isPublic,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="text-slate-700">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none ring-0 focus:border-brand-700"
            placeholder="Sensor do Rio"
          />
        </label>

        <label className="block text-sm">
          <span className="text-slate-700">Código</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none ring-0 focus:border-brand-700"
            placeholder="SENSOR-XYZ"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-slate-700">Latitude</span>
            <input
              value={latitude ?? ""}
              onChange={(e) => setLatitude(e.target.value === "" ? undefined : Number(e.target.value))}
              type="number"
              step="any"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none ring-0 focus:border-brand-700"
              placeholder="-3.777777"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-700">Longitude</span>
            <input
              value={longitude ?? ""}
              onChange={(e) => setLongitude(e.target.value === "" ? undefined : Number(e.target.value))}
              type="number"
              step="any"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none ring-0 focus:border-brand-700"
              placeholder="-40.123456"
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-slate-700">Público</span>
        </label>

        <div className="pt-2">
          <Button disabled={disabled} loading={submitting} onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-2">
        <MapPicker
          latitude={latitude ?? undefined}
          longitude={longitude ?? undefined}
          onChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
      </div>
    </div>
  );
}

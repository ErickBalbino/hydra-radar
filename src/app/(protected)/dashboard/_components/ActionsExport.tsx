"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

type Kind = "readings" | "alerts";
type Format = "csv" | "json";

const BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");

function buildUrl(kind: Kind, format: Format) {
  const path = `/export/${kind}.${format}`;
  return `${BASE}${path}`;
}

function filenameFromHeaders(headers: Headers, fallback: string) {
  const cd = headers.get("content-disposition");
  if (!cd) return fallback;
  const m = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
  const raw = decodeURIComponent(m?.[1] ?? m?.[2] ?? fallback);
  return raw.replace(/[/\\?%*:|"<>]/g, "_");
}

interface Props {
  token: string;
}

export default function ActionsExport({token}: Props) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function download(kind: Kind, format: Format) {
    const key = `${kind}-${format}`;
    setLoadingKey(key);
    try {
      const url = buildUrl(kind, format);
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: format === "json" ? "application/json" : "text/csv",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const blob = await res.blob();
      const suggested = filenameFromHeaders(
        res.headers,
        `${kind}-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "")}.${format}`
      );

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = suggested;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <h3 className="text-lg font-semibold text-brand-800">Exportar dados</h3>
      <div className="ml-auto flex gap-2">
        <Button
          variant="outline"
          loading={loadingKey === "readings-csv"}
          onClick={() => download("readings", "csv")}
        >
          Leituras CSV
        </Button>
        <Button
          variant="outline"
          loading={loadingKey === "readings-json"}
          onClick={() => download("readings", "json")}
        >
          Leituras JSON
        </Button>
        <Button
          variant="outline"
          loading={loadingKey === "alerts-csv"}
          onClick={() => download("alerts", "csv")}
        >
          Alertas CSV
        </Button>
        <Button
          variant="outline"
          loading={loadingKey === "alerts-json"}
          onClick={() => download("alerts", "json")}
        >
          Alertas JSON
        </Button>
      </div>
    </div>
  );
}

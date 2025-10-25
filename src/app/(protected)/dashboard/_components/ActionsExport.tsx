"use client";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function ActionsExport() {
  const [loading, setLoading] = useState<string | null>(null);

  async function download(url: string, name: string) {
    setLoading(name);
    try {
      const r = await fetch(url);
      if (r.status >= 200 && r.status < 300) {
        const blob = await r.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${name}-${Date.now()}.${
          url.includes("json") ? "json" : "csv"
        }`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <h3 className="text-lg font-semibold text-brand-800">Exportar dados</h3>
      <div className="ml-auto flex gap-2">
        <Button
          variant="outline"
          onClick={() =>
            download("/api/export/readings?format=csv", "leituras")
          }
          loading={loading === "leituras"}
        >
          Leituras CSV
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            download("/api/export/readings?format=json", "leituras")
          }
          loading={loading === "leituras"}
        >
          Leituras JSON
        </Button>
        <Button
          variant="outline"
          onClick={() => download("/api/export/alerts?format=csv", "alertas")}
          loading={loading === "alertas"}
        >
          Alertas CSV
        </Button>
        <Button
          variant="outline"
          onClick={() => download("/api/export/alerts?format=json", "alertas")}
          loading={loading === "alertas"}
        >
          Alertas JSON
        </Button>
      </div>
    </div>
  );
}

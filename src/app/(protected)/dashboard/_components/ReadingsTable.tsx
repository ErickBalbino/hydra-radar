"use client";

type Reading = {
  id: string;
  sensorId: string;
  type: string;
  value: number;
  timestamp: string;
};

export default function ReadingsTable({ readings }: { readings: Reading[] }) {
  const rows = readings ?? [];
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[760px] w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2 pr-3">Sensor</th>
            <th className="py-2 pr-3">Tipo</th>
            <th className="py-2 pr-3">Valor</th>
            <th className="py-2 pr-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2 pr-3">{r.sensorId}</td>
              <td className="py-2 pr-3">{r.type}</td>
              <td className="py-2 pr-3">{r.value}</td>
              <td className="py-2 pr-3">
                {new Date(r.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

type Sensor = {
  id: string;
  name: string;
  type: string;
  isPublic?: boolean;
};

export default function SensorsTable({ sensors }: { sensors: Sensor[] }) {
  const rows = sensors ?? [];
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[680px] w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2 pr-3">Nome</th>
            <th className="py-2 pr-3">Tipo</th>
            <th className="py-2 pr-3">Público</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="py-2 pr-3">{s.name}</td>
              <td className="py-2 pr-3">{s.type}</td>
              <td className="py-2 pr-3">{s.isPublic ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";
import SensorsTable from "../../_components/SensorsTable";

type Sensor = {
  id: string;
  name: string;
  type: string;
  isPublic?: boolean;
};

export default function SensoresClient({ sensors }: { sensors: Sensor[] }) {
  return <SensorsTable sensors={sensors} />;
}

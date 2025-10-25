"use client";
import ReadingsTable from "../../_components/ReadingsTable";

type Reading = {
  id: string;
  sensorId: string;
  type: string;
  value: number;
  timestamp: string;
};

export default function LeiturasClient({ readings }: { readings: Reading[] }) {
  return <ReadingsTable readings={readings} />;
}

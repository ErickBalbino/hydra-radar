"use client";
import dynamic from "next/dynamic";
const ActionsExport = dynamic(() => import("../../_components/ActionsExport"), {
  ssr: false,
});

interface Props {
  token: string;
}

export default function ExportarClient({token}: Props) {
  return <ActionsExport token={token} />;
}

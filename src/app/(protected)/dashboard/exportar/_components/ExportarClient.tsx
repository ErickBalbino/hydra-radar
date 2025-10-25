"use client";

import dynamic from "next/dynamic";

const ActionsExport = dynamic(() => import("../../_components/ActionsExport"), {
  ssr: false,
});

export default function ExportarClient() {
  return <ActionsExport />;
}

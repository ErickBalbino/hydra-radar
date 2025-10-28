"use client";

import NextTopLoader from "nextjs-toploader";

export default function ProgressLoader() {
  return (
    <NextTopLoader
      color="#21485f"
      height={6}
      showSpinner={false}
      crawlSpeed={120}
      shadow={false}
    />
  );
}

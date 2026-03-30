"use client";

import dynamic from "next/dynamic";

const PretextPlayground = dynamic(
  () => import("@/app/_components/pretext/pretext-playground"),
  { ssr: false },
);

export default function PlaygroundPage() {
  return <PretextPlayground />;
}

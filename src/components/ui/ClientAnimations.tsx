"use client";

import dynamic from "next/dynamic";

const SiteAnimations = dynamic(() => import("./SiteAnimations"), { ssr: false });
const PwaRegister = dynamic(() => import("./PwaRegister"), { ssr: false });

export default function ClientAnimations() {
  return (
    <>
      <SiteAnimations />
      <PwaRegister />
    </>
  );
}

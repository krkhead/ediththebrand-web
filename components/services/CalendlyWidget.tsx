"use client";

import dynamic from "next/dynamic";

const InlineWidget = dynamic(
  () => import("react-calendly").then((mod) => mod.InlineWidget),
  { ssr: false, loading: () => <div className="h-[600px] bg-[#F0EAE0] animate-pulse" /> }
);

export default function CalendlyWidget() {
  return (
    <div className="rounded-none overflow-hidden border border-[#E0D8CE]">
      <InlineWidget
        url={process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/editholufestus/30min"}
        styles={{ height: "650px", width: "100%" }}
        pageSettings={{
          backgroundColor: "F8F4EE",
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: "E8A020",
          textColor: "3D2E24",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-4">
          Something went wrong
        </p>
        <h1
          className="text-6xl text-[#3D2E24] mb-6"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Error
        </h1>
        <p className="text-[#8A7D72] mb-8 leading-relaxed">
          We ran into an unexpected issue. Please try again, or head back to the
          shop.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="text-sm px-6 py-3 bg-[#3D2E24] text-[#F8F4EE] tracking-widest hover:bg-[#2a1f18] transition-colors"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="text-sm px-6 py-3 border border-[#3D2E24] text-[#3D2E24] tracking-widest hover:bg-[#3D2E24] hover:text-[#F8F4EE] transition-colors"
          >
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

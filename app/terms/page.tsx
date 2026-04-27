import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Basic purchase, booking, and usage terms for Ediththebrand customers.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-36">
      <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
        Terms
      </p>
      <h1
        className="mt-3 text-5xl text-[#3D2E24] md:text-6xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Terms of service
      </h1>
      <div className="mt-10 space-y-8 text-[#6D6055]">
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Orders and availability</h2>
          <p>
            Orders are subject to stock confirmation. Ediththebrand may cancel
            or adjust an order if an item becomes unavailable or if listing
            details need correction.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Consultation bookings</h2>
          <p>
            Consultation slots are reserved after payment. Missed sessions,
            late cancellations, and reschedule requests may be handled
            according to the consultation terms shown at booking.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Product guidance</h2>
          <p>
            Skincare recommendations are informational and should be used with
            personal judgment. Customers are responsible for reviewing product
            ingredients and patch-testing where appropriate.
          </p>
        </section>
      </div>
    </div>
  );
}

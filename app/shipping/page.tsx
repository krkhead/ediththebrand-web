import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "Shipping timelines, processing expectations, and delivery notes for Ediththebrand orders.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-36">
      <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
        Shipping
      </p>
      <h1
        className="mt-3 text-5xl text-[#3D2E24] md:text-6xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Delivery information
      </h1>
      <div className="mt-10 space-y-8 text-[#6D6055]">
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Processing</h2>
          <p>
            Orders are confirmed manually after payment and availability checks.
            You will receive a WhatsApp confirmation before dispatch.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Estimated timelines</h2>
          <p>Within Lagos: 2 to 3 working days.</p>
          <p>Outside Lagos: 4 to 7 working days.</p>
          <p>
            Some extreme or hard-to-reach locations may take longer depending
            on courier coverage.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Important notes</h2>
          <p>
            Delivery timelines begin after payment has been confirmed, not at
            the moment an order message is sent.
          </p>
          <p>
            Customers should ensure the provided phone number, delivery address,
            and recipient details are accurate to avoid dispatch delays.
          </p>
        </section>
      </div>
    </div>
  );
}

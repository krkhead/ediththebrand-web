import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "Returns, exchanges, and order issue guidance for Ediththebrand purchases.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-36">
      <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
        Returns
      </p>
      <h1
        className="mt-3 text-5xl text-[#3D2E24] md:text-6xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Returns and exchanges
      </h1>
      <div className="mt-10 space-y-8 text-[#6D6055]">
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Due to product safety</h2>
          <p>
            Skincare, cosmetic, and personal care items are generally not
            returnable once delivered unless the wrong item was sent, the item
            arrived damaged, or there is a verified fulfillment issue.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Report an issue quickly</h2>
          <p>
            Please contact Ediththebrand within 24 hours of delivery with your
            order details, a clear description of the issue, and supporting
            photos or video where relevant.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">Resolution</h2>
          <p>
            Approved issues may be resolved through replacement, exchange,
            store credit, or another fair remedy depending on product
            condition and stock availability.
          </p>
        </section>
      </div>
    </div>
  );
}

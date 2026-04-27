import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Ediththebrand handles contact details, order information, and customer communication.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-36">
      <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
        Privacy
      </p>
      <h1
        className="mt-3 text-5xl text-[#3D2E24] md:text-6xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Privacy policy
      </h1>
      <div className="mt-10 space-y-8 text-[#6D6055]">
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">What we collect</h2>
          <p>
            Ediththebrand may collect your name, phone number, email address,
            delivery address, order details, and consultation information when
            you place an order or book a service.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">How it is used</h2>
          <p>
            This information is used to confirm orders, coordinate delivery,
            provide consultations, respond to customer support requests, and
            improve service quality.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl text-[#3D2E24]">How it is shared</h2>
          <p>
            Customer information is not sold. It may be shared only when needed
            to complete delivery, process services, or comply with legal
            obligations.
          </p>
        </section>
      </div>
    </div>
  );
}

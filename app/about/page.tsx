import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FAQSection from "@/components/home/FAQSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "4 years of skin-first service. Authentic skincare sourced from the US, GB, KR, and JP. Lagos, Nigeria.",
};


export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-[#3D2E24] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-4">
            Our Story
          </p>
          <h1
            className="text-6xl md:text-8xl text-[#F8F4EE] leading-none"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Skin First.
            <br />
            <span className="italic text-[#8A7D72]">Self-care</span>
            <br />
            Always.
          </h1>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-16 mb-0 items-center">
          <div className="space-y-6">
            <h2
              className="text-5xl text-[#3D2E24]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              What we believe
            </h2>
            <p className="text-[#8A7D72] leading-relaxed">
              Great skin shouldn&apos;t be hard to find. We started Ediththebrand
              because we believed Lagos deserved access to the same authentic,
              high-performance skincare as anywhere else in the world.
            </p>
            <p className="text-[#8A7D72] leading-relaxed">
              Everything we carry is sourced directly from the US, UK, Korea,
              and Japan. No grey-market goods, no compromises. 100% authentic,
              every time.
            </p>
            <p className="text-[#8A7D72] leading-relaxed">
              We don&apos;t manufacture products, we find the best ones. We test,
              research, and only stock what actually works.
            </p>

            {/* Origin tags */}
            <div className="flex gap-3 flex-wrap pt-2">
              {["US", "GB", "KR", "JP"].map((o) => (
                <span
                  key={o}
                  className="border border-[#3D2E24] text-[#3D2E24] text-sm px-5 py-2 tracking-widest"
                  style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                >
                  {o}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-[480px]">
            <Image
              src="/brand/IMG_7787.JPG.jpeg"
              alt="Ediththebrand products"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3D2E24]/80 to-transparent p-6">
              <p
                className="text-2xl text-[#E8A020]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                4 years. Real skin. Real results.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* FAQ Section */}
      <FAQSection />

      <div className="max-w-7xl mx-auto px-6 pb-20">

        {/* CTA */}
        <div className="text-center bg-[#3D2E24] py-16 px-6">
          <p
            className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-4"
          >
            Still growing. Still here.
          </p>
          <h2
            className="text-5xl text-[#F8F4EE] mb-6"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Ready to begin your
            <br />
            skin-first journey?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#E8A020] text-[#3D2E24] px-8 py-3 text-sm font-medium hover:bg-[#d4911a] transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/services"
              className="border border-[#F8F4EE]/40 text-[#F8F4EE] px-8 py-3 text-sm hover:border-[#E8A020] hover:text-[#E8A020] transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

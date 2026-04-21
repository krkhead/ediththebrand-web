"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "4", label: "Years in Business" },
  { value: "4", label: "Countries Sourced" },
  { value: "339+", label: "Posts & Products" },
  { value: "100%", label: "Authentic" },
];

const origins = ["US", "GB", "KR", "JP"];

export default function BrandStatement() {
  return (
    <section className="bg-[#F8F4EE] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase">
              Our Story
            </p>
            <h2
              className="text-5xl md:text-6xl text-[#3D2E24] leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Four years of
              <br />
              skin-first
              <br />
              <span className="italic text-[#2C7A2C]">devotion.</span>
            </h2>
            <p className="text-[#8A7D72] leading-relaxed text-base max-w-md">
              We source skincare from the US, UK, Korea and Japan. Brands that
              actually work. Every product is hand-picked, authentic, and shipped
              straight to you in Lagos.
            </p>
            {/* Origin tags */}
            <div className="flex gap-3 flex-wrap pt-2">
              {origins.map((o) => (
                <span
                  key={o}
                  className="border border-[#3D2E24] text-[#3D2E24] text-sm px-4 py-1 tracking-widest"
                  style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                >
                  {o}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-px bg-[#E0D8CE]"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-[#F8F4EE] p-8 space-y-1 hover:bg-[#F0EAE0] transition-colors"
              >
                <p
                  className="text-5xl text-[#E8A020]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-[#8A7D72] tracking-wide uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

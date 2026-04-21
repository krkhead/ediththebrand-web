"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const faqImages = [
  "/brand/faq1.jpg",
  "/brand/faq2.jpg",
  "/brand/faq3.jpg",
  "/brand/faq4.jpg",
  "/brand/faq5.jpg",
  "/brand/faq6.jpg",
];

export default function FAQSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-[#F8F4EE] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#E0D8CE]" />
          <div className="text-center space-y-1 shrink-0">
            <p
              className="text-[#E8A020] text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-dm-mono), monospace" }}
            >
              Need to Know
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#3D2E24]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              FAQ
            </h2>
          </div>
          <div className="h-px flex-1 bg-[#E0D8CE]" />
        </div>

        {/* 3-per-row grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faqImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="cursor-pointer overflow-hidden group border border-[#E0D8CE]"
              onClick={() => setActive(active === i ? null : i)}
            >
              <Image
                src={src}
                alt={`Ediththebrand FAQ ${i + 1}`}
                width={600}
                height={600}
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[#3D2E24]/90 flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={faqImages[active]}
                alt={`Ediththebrand FAQ ${active + 1}`}
                width={800}
                height={800}
                className="w-full h-auto object-contain"
              />
              {/* Nav arrows */}
              <button
                onClick={() =>
                  setActive((active - 1 + faqImages.length) % faqImages.length)
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-[#F8F4EE] hover:text-[#E8A020] transition-colors text-3xl leading-none hidden sm:block"
              >
                ‹
              </button>
              <button
                onClick={() => setActive((active + 1) % faqImages.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-[#F8F4EE] hover:text-[#E8A020] transition-colors text-3xl leading-none hidden sm:block"
              >
                ›
              </button>
              {/* Close */}
              <button
                onClick={() => setActive(null)}
                className="absolute -top-10 right-0 text-[#F8F4EE] hover:text-[#E8A020] text-sm tracking-widest uppercase transition-colors"
              >
                Close ×
              </button>
              {/* Counter */}
              <p
                className="text-center text-[#8A7D72] text-xs tracking-widest mt-3"
                style={{ fontFamily: "var(--font-dm-mono), monospace" }}
              >
                {active + 1} / {faqImages.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

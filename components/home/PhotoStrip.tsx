"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  { src: "/brand/IMG_3637.JPG.jpeg", aspect: "aspect-[3/4]" },
  { src: "/brand/IMG_3940.JPG.jpeg", aspect: "aspect-square" },
  { src: "/brand/IMG_7312.JPG.jpeg", aspect: "aspect-[3/4]" },
  { src: "/brand/IMG_7787.JPG.jpeg", aspect: "aspect-square" },
];

export default function PhotoStrip() {
  return (
    <section className="bg-[#F8F4EE] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-[#E0D8CE]" />
          <p
            className="text-[#8A7D72] text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-dm-mono), monospace" }}
          >
            @ediththebrand
          </p>
          <div className="h-px flex-1 bg-[#E0D8CE]" />
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative ${photo.aspect} overflow-hidden bg-[#E0D8CE] group`}
            >
              <Image
                src={photo.src}
                alt={`Ediththebrand product ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/ediththebrand/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#8A7D72] hover:text-[#E8A020] transition-colors"
          >
            Follow us on Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}

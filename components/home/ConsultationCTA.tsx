"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Video, FileText } from "lucide-react";

const perks = [
  { icon: Clock, text: "30-minute virtual session" },
  { icon: Video, text: "Google Meet, wherever you are" },
  { icon: FileText, text: "Personalised PDF routine" },
];

export default function ConsultationCTA() {
  return (
    <section className="bg-[#F0EAE0] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative h-[480px] order-2 md:order-1"
        >
          <Image
            src="/brand/IMG_6389.JPG.jpeg"
            alt="Skincare consultation products"
            fill
            className="object-cover"
          />
          {/* Price badge */}
          <div className="absolute bottom-6 left-6 bg-[#3D2E24] text-[#F8F4EE] p-5">
            <p className="text-xs text-[#8A7D72] tracking-widest uppercase mb-1">
              Consultation Fee
            </p>
            <p
              className="text-3xl text-[#E8A020]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              ₦25,000
            </p>
            <p className="text-xs text-[#8A7D72] mt-1">
              Includes 2 months follow-up
            </p>
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-6 order-1 md:order-2"
        >
          <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase">
            Virtual Consultation
          </p>
          <h2
            className="text-5xl md:text-6xl text-[#3D2E24] leading-tight"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Your Skin,
            <br />
            <span className="italic">Understood.</span>
          </h2>
          <p className="text-[#8A7D72] leading-relaxed">
            One 30-minute session covering your skin concerns, current routine,
            skin type and budget. You walk away with a personalised skincare
            PDF: your exact next steps, nothing generic.
          </p>

          {/* Perks */}
          <ul className="space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8A020]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#E8A020]" />
                </div>
                <span className="text-sm text-[#3D2E24]">{text}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#3D2E24] text-[#F8F4EE] px-8 py-4 text-sm tracking-wide hover:bg-[#2A1F18] transition-colors mt-2"
          >
            Book Your Session <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

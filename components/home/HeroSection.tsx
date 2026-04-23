"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ShopSearchForm from "@/components/shop/ShopSearchForm";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#3D2E24]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/brand/IMG_3841.JPG.jpeg"
          alt="Ediththebrand hero"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2E24] via-[#3D2E24]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 grid md:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#E8A020] text-sm tracking-[0.3em] uppercase"
          >
            Ediththebrand · ETBstore
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl text-[#F8F4EE] leading-none"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Skin
            <br />
            <span className="text-[#E8A020] italic">First.</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl md:text-4xl text-[#F8F4EE]/70 leading-tight"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Self-care Always.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-[#8A7D72] text-base leading-relaxed max-w-md"
          >
            Authentic skincare from the US, UK, Korea and Japan. Found,
            tested and brought straight to you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              href="/shop"
              className="flex items-center gap-2 bg-[#E8A020] text-[#3D2E24] px-7 py-3 text-sm font-medium tracking-wide hover:bg-[#d4911a] transition-colors"
            >
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-2 border border-[#F8F4EE]/40 text-[#F8F4EE] px-7 py-3 text-sm tracking-wide hover:border-[#E8A020] hover:text-[#E8A020] transition-colors"
            >
              Book Consultation
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="max-w-xl pt-2"
          >
            <ShopSearchForm
              placeholder="Search by product name, category or origin"
            />
          </motion.div>
        </div>

        {/* Right side product image collage */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:grid grid-cols-2 gap-3 h-[520px]"
        >
          <div className="relative col-span-1 row-span-2">
            <Image
              src="/brand/IMG_6389.JPG.jpeg"
              alt="Skincare product"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src="/brand/IMG_1549.JPG.jpeg"
              alt="Skincare product"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative">
            <Image
              src="/brand/IMG_4709.JPG.jpeg"
              alt="Skincare product"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#E8A020] animate-pulse" />
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { totalItems, openCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/services", label: "Consultations" },
    { href: "/about", label: "About" },
  ];

  const navTextColor = scrolled ? "text-[#3D2E24]" : "text-[#F8F4EE]";
  const navHoverColor = scrolled ? "hover:text-[#E8A020]" : "hover:text-[#E8A020]";

  return (
    <>
      <nav
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F8F4EE]/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/brand/logo.png"
              alt="Ediththebrand"
              width={44}
              height={44}
              className="rounded-full"
            />
            <span
              className={`hidden text-xl tracking-wide sm:block ${navTextColor}`}
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Ediththebrand
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`gold-underline text-sm font-medium tracking-wide transition-colors ${navTextColor} ${navHoverColor}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className={`relative p-2 transition-colors ${navTextColor} ${navHoverColor}`}
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#E8A020] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className={`p-2 md:hidden ${navTextColor}`}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-9 z-[60] bg-[#3D2E24] flex flex-col">
          <div className="flex items-center justify-between px-6 py-5">
            <Image
              src="/brand/logo.png"
              alt="Ediththebrand"
              width={40}
              height={40}
              className="rounded-full"
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="text-[#F8F4EE]"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-4xl text-[#F8F4EE] font-display tracking-wide hover:text-[#E8A020] transition-colors"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-6 pb-8 text-center">
            <p className="text-[#8A7D72] text-sm italic">
              Skin First. Self-care Always.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

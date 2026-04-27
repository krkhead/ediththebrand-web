import Link from "next/link";
import Image from "next/image";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const footerLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Book Consultation" },
  { href: "/about", label: "About" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#3D2E24] text-[#F8F4EE]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo.png"
                alt="Ediththebrand"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span
                className="text-2xl text-[#E8A020]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Ediththebrand
              </span>
            </div>
            <p className="text-[#8A7D72] text-sm leading-relaxed">
              Skin First. Self-care Always.
              <br />
              Authentic skincare from the US, UK, Korea and Japan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/ediththebrand/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#8A7D72] hover:text-[#E8A020] transition-colors text-sm"
              >
                <InstagramIcon size={18} />
                @ediththebrand
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4
              className="text-[#E8A020] text-lg"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#8A7D72] text-sm hover:text-[#F8F4EE] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4
              className="text-[#E8A020] text-lg"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Get in Touch
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/2349049695621"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8A7D72] hover:text-[#E8A020] transition-colors"
                >
                  WhatsApp - +234 904 969 5621
                </a>
              </li>
              <li>
                <a
                  href="mailto:editholufestus@gmail.com"
                  className="text-[#8A7D72] hover:text-[#E8A020] transition-colors"
                >
                  editholufestus@gmail.com
                </a>
              </li>
              <li className="text-[#8A7D72]">Lagos, Nigeria</li>
            </ul>
            <Link
              href="/services"
              className="inline-block mt-2 border border-[#E8A020] text-[#E8A020] text-sm px-5 py-2 hover:bg-[#E8A020] hover:text-[#3D2E24] transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        <div className="border-t border-[#5A4535] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#8A7D72] text-xs">
            Copyright 2025 Ediththebrand. All rights reserved.
          </p>
          <p className="text-[#8A7D72] text-xs">
            4 years of skin-first service - Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}

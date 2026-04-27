import type { Metadata } from "next";
import Image from "next/image";
import CalendlyWidget from "@/components/services/CalendlyWidget";
import {
  Clock,
  Video,
  FileText,
  MessageCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Skincare Consultation",
  description:
    "Book a 30-minute virtual skincare consultation with Ediththebrand. NGN 25,000 includes 2 months of follow-up support.",
};

const whatHappens = [
  "Discuss your skin concerns in detail",
  "Review your current skincare routine",
  "Consider your skin type and budget",
];

const afterSession = [
  "Recommended products list",
  "Step-by-step usage instructions",
  "Routine structure tailored specifically to you",
];

const perks = [
  { icon: Clock, title: "30 Minutes", desc: "Focused, one-on-one session" },
  { icon: Video, title: "Virtual", desc: "Google Meet, wherever you are" },
  {
    icon: FileText,
    title: "Personalised PDF",
    desc: "Your custom routine, delivered",
  },
  {
    icon: MessageCircle,
    title: "2 Months Follow-up",
    desc: "Progress monitoring via WhatsApp",
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="relative bg-[#3D2E24] pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/brand/IMG_6389.JPG.jpeg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-4">
            Virtual Consultation
          </p>
          <h1
            className="text-6xl md:text-8xl text-[#F8F4EE] leading-none"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Your Skin,
            <br />
            <span className="italic">Understood.</span>
          </h1>
          <p className="text-[#8A7D72] mt-6 text-base max-w-xl mx-auto leading-relaxed">
            One 30-minute session. Personalised advice. A complete routine
            built around you, not a generic list.
          </p>
        </div>
      </div>

      <div className="bg-[#F8F4EE] border-b border-[#E0D8CE]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-[#E8A020]/10 flex items-center justify-center">
                <Icon size={20} className="text-[#E8A020]" />
              </div>
              <p
                className="text-lg text-[#3D2E24]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {title}
              </p>
              <p className="text-xs text-[#8A7D72]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h2
              className="text-3xl text-[#3D2E24] mb-4"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              During the Session
            </h2>
            <ul className="space-y-3">
              {whatHappens.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-[#2C7A2C] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[#3D2E24]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2
              className="text-3xl text-[#3D2E24] mb-4"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              After the Session
            </h2>
            <p className="text-sm text-[#8A7D72] mb-3">
              You receive a personalised PDF containing:
            </p>
            <ul className="space-y-3">
              {afterSession.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-[#E8A020] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[#3D2E24]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#3D2E24] p-8 space-y-4">
            <h2
              className="text-3xl text-[#F8F4EE]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Investment
            </h2>
            <p
              className="text-5xl text-[#E8A020]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              NGN 25,000
            </p>
            <p className="text-sm text-[#8A7D72]">
              Includes 2 months of follow-up support via WhatsApp text
              messages.
            </p>
            <div className="border-t border-[#5A4535] pt-4 space-y-2">
              <p className="text-xs text-[#8A7D72] font-medium uppercase tracking-wide">
                Payment Details
              </p>
              <p className="text-sm text-[#F8F4EE]">Bank: Moniepoint MFB</p>
              <p className="text-sm text-[#F8F4EE]">Account: 9049695621</p>
              <p className="text-sm text-[#F8F4EE]">Name: Ediththebrand</p>
            </div>
            <div className="border-t border-[#5A4535] pt-4 space-y-2">
              <p className="text-xs text-[#8A7D72] font-medium uppercase tracking-wide">
                Contact
              </p>
              <a
                href="https://wa.me/2349049695621"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#F8F4EE] hover:text-[#E8A020] transition-colors"
              >
                WhatsApp - +234 904 969 5621
              </a>
              <a
                href="mailto:editholufestus@gmail.com"
                className="block text-sm text-[#F8F4EE] hover:text-[#E8A020] transition-colors"
              >
                editholufestus@gmail.com
              </a>
              <p className="text-sm text-[#8A7D72]">Lagos, Nigeria</p>
            </div>
          </div>

          <div className="flex gap-3 border-l-2 border-[#E8A020] pl-4">
            <AlertCircle
              size={18}
              className="text-[#E8A020] flex-shrink-0 mt-0.5"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#3D2E24]">Important</p>
              <p className="text-sm text-[#8A7D72]">
                Appointments are automatically cancelled if payment is not
                received within 1 hour of booking. You may reschedule once, at
                least 8 hours before your session.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2
            className="text-3xl text-[#3D2E24] mb-6"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Book Your Session
          </h2>
          <CalendlyWidget />
        </div>
      </div>
    </>
  );
}

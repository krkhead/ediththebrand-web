import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-4">
          Page not found
        </p>
        <h1
          className="text-[12rem] leading-none text-[#3D2E24] opacity-10 select-none"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          404
        </h1>
        <p
          className="text-4xl text-[#3D2E24] -mt-8 mb-6"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Lost in the routine
        </p>
        <p className="text-[#8A7D72] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. Maybe it moved,
          or maybe it was never here.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/shop"
            className="text-sm px-6 py-3 bg-[#3D2E24] text-[#F8F4EE] tracking-widest hover:bg-[#2a1f18] transition-colors"
          >
            BROWSE THE SHOP
          </Link>
          <Link
            href="/"
            className="text-sm px-6 py-3 border border-[#3D2E24] text-[#3D2E24] tracking-widest hover:bg-[#3D2E24] hover:text-[#F8F4EE] transition-colors"
          >
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

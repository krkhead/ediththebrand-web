"use client";

import DeliveryBanner from "@/components/layout/DeliveryBanner";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/shop/CartDrawer";
import { usePathname } from "next/navigation";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <DeliveryBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

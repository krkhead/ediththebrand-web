import CouponForm from "@/components/admin/CouponForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/coupons"
          className="mb-4 flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#3D2E24]"
        >
          <ChevronLeft size={16} />
          Back to Coupons
        </Link>
        <h1
          className="text-4xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Add New Coupon
        </h1>
      </div>
      <CouponForm mode="new" />
    </div>
  );
}

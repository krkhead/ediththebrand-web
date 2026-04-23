import CouponForm from "@/components/admin/CouponForm";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let coupon = null;
  try {
    const [found] = await db.select().from(coupons).where(eq(coupons.id, id));
    coupon = found;
  } catch {
    // DB not configured
  }

  if (!coupon) notFound();

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
          Edit Coupon
        </h1>
        <p className="mt-1 text-sm text-gray-500">{coupon.code}</p>
      </div>
      <CouponForm coupon={coupon} mode="edit" />
    </div>
  );
}

import { db } from "@/lib/db";
import { coupons, type Coupon } from "@/lib/db/schema";
import Link from "next/link";
import { PlusCircle, Pencil, TicketPercent } from "lucide-react";
import DeleteCouponButton from "@/components/admin/DeleteCouponButton";
import ToggleCouponButton from "@/components/admin/ToggleCouponButton";
import { desc } from "drizzle-orm";
import { formatNaira } from "@/lib/shop-utils";

export default async function AdminCouponsPage() {
  let allCoupons: Coupon[] = [];

  try {
    allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  } catch {
    // DB not yet configured or coupons table not created
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl text-[#3D2E24]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Coupons
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {allCoupons.length} coupon{allCoupons.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="flex items-center gap-2 bg-[#E8A020] px-5 py-2.5 text-sm font-medium text-[#3D2E24] transition-colors hover:bg-[#d4911a]"
        >
          <PlusCircle size={18} />
          Add Coupon
        </Link>
      </div>

      {allCoupons.length === 0 ? (
        <div className="border border-gray-100 bg-white p-16 text-center">
          <TicketPercent size={36} className="mx-auto mb-4 text-[#E8A020]" />
          <p className="mb-4 text-gray-400">
            No coupons yet. If you just added the new coupon system, run
            <span className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">
              npm run db:push
            </span>
            first.
          </p>
          <Link
            href="/admin/coupons/new"
            className="inline-flex items-center gap-2 bg-[#3D2E24] px-6 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18]"
          >
            <PlusCircle size={18} />
            Add your first coupon
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                  Label
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                  Discount
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                  Active
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allCoupons.map((coupon) => (
                <tr key={coupon.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="rounded bg-[#3D2E24]/5 px-2 py-1 font-mono text-xs text-[#3D2E24]">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{coupon.label}</td>
                  <td className="px-4 py-4 text-gray-600">
                    {coupon.type === "percent"
                      ? `${coupon.value}%`
                      : formatNaira(coupon.value)}
                  </td>
                  <td className="px-4 py-4">
                    <ToggleCouponButton id={coupon.id} value={coupon.active ?? true} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/coupons/${coupon.id}`}
                        className="p-1.5 text-gray-400 transition-colors hover:text-[#3D2E24]"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteCouponButton id={coupon.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { db } from "@/lib/db";
import { coupons, products } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import { Package, Star, CheckCircle, PlusCircle, TicketPercent } from "lucide-react";

export default async function AdminDashboard() {
  let total = 0;
  let inStock = 0;
  let featured = 0;
  let activeCoupons = 0;

  try {
    const [totalResult] = await db.select({ count: count() }).from(products);
    const [inStockResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.inStock, true));
    const [featuredResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.featured, true));
    const [couponResult] = await db
      .select({ count: count() })
      .from(coupons)
      .where(eq(coupons.active, true));

    total = totalResult.count;
    inStock = inStockResult.count;
    featured = featuredResult.count;
    activeCoupons = couponResult.count;
  } catch {
    // DB not yet connected
  }

  const stats = [
    { label: "Total Products", value: total, icon: Package, color: "text-[#3D2E24]" },
    { label: "In Stock", value: inStock, icon: CheckCircle, color: "text-[#2C7A2C]" },
    { label: "Featured", value: featured, icon: Star, color: "text-[#E8A020]" },
    { label: "Active Coupons", value: activeCoupons, icon: TicketPercent, color: "text-[#A14D2A]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-4xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your Ediththebrand store
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p
                  className={`text-5xl mt-1 ${color}`}
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {value}
                </p>
              </div>
              <Icon size={32} className={`${color} opacity-20`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 p-6 shadow-sm">
        <h2
          className="text-2xl text-[#3D2E24] mb-4"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#E8A020] text-[#3D2E24] px-6 py-3 text-sm font-medium hover:bg-[#d4911a] transition-colors"
          >
            <PlusCircle size={18} />
            Add New Product
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 border border-[#3D2E24] text-[#3D2E24] px-6 py-3 text-sm hover:bg-[#3D2E24] hover:text-white transition-colors"
          >
            <Package size={18} />
            Manage Products
          </Link>
          <Link
            href="/admin/coupons"
            className="flex items-center gap-2 border border-[#E8A020] text-[#A14D2A] px-6 py-3 text-sm hover:bg-[#E8A020]/10 transition-colors"
          >
            <TicketPercent size={18} />
            Manage Coupons
          </Link>
          <Link
            href="/shop"
            target="_blank"
            className="flex items-center gap-2 border border-gray-200 text-gray-500 px-6 py-3 text-sm hover:border-gray-400 transition-colors"
          >
            View Shop →
          </Link>
        </div>
      </div>

      {/* Setup checklist when DB is empty */}
      {total === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-6">
          <h3 className="font-medium text-amber-800 mb-3">Getting Started</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>✓ Website is live and running</li>
            <li>○ Add your Neon database URL to environment variables</li>
            <li>○ Add your Cloudinary credentials to environment variables</li>
            <li>○ Run <code className="bg-amber-100 px-1">npm run db:push</code> to create the database tables</li>
            <li>○ Add your first product using the &quot;Add New Product&quot; button above</li>
          </ul>
        </div>
      )}
    </div>
  );
}

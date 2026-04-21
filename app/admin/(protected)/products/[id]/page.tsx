import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product = null;
  try {
    const [found] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    product = found;
  } catch {
    // DB not configured
  }

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#3D2E24] transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Products
        </Link>
        <h1
          className="text-4xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Edit Product
        </h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} mode="edit" />
    </div>
  );
}

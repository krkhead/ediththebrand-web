import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProductPage() {
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
          Add New Product
        </h1>
      </div>
      <ProductForm mode="new" />
    </div>
  );
}

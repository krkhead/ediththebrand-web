import { db } from "@/lib/db";
import { products, type Product } from "@/lib/db/schema";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Pencil } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ToggleProductButton from "@/components/admin/ToggleProductButton";

export default async function AdminProductsPage() {
  let allProducts: Product[] = [];
  try {
    allProducts = await db.select().from(products).orderBy(products.createdAt);
  } catch {
    // DB not yet configured
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl text-[#3D2E24]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {allProducts.length} product{allProducts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#E8A020] text-[#3D2E24] px-5 py-2.5 text-sm font-medium hover:bg-[#d4911a] transition-colors"
        >
          <PlusCircle size={18} />
          Add Product
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <p className="text-gray-400 mb-4">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#3D2E24] text-white px-6 py-3 text-sm hover:bg-[#2A1F18] transition-colors"
          >
            <PlusCircle size={18} />
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Origin
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  In Stock
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Featured
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Home Labels
                </th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allProducts.map((product) => {
                const images = product.images as string[];
                const thumb = images?.[0];
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative bg-gray-100 flex-shrink-0">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#3D2E24]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.category || "—"}
                    </td>
                    <td className="px-4 py-4">
                      {product.origin ? (
                        <span className="bg-[#E8A020]/10 text-[#E8A020] text-xs px-2 py-0.5 font-mono">
                          {product.origin}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.price
                        ? `₦${parseFloat(product.price).toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <ToggleProductButton
                        id={product.id}
                        field="inStock"
                        value={product.inStock ?? true}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <ToggleProductButton
                        id={product.id}
                        field="featured"
                        value={product.featured ?? false}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {product.isNewArrival && (
                          <span className="bg-[#A14D2A]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#A14D2A]">
                            New Arrival
                          </span>
                        )}
                        {product.isBackInStock && (
                          <span className="bg-[#7A5C43]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7A5C43]">
                            Back in Stock
                          </span>
                        )}
                        {!product.isNewArrival && !product.isBackInStock && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 text-gray-400 hover:text-[#3D2E24] transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

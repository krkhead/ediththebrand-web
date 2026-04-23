import DeleteCollectionButton from "@/components/admin/DeleteCollectionButton";
import { db } from "@/lib/db";
import { categories, type Category } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Layers3, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AdminCollectionsPage() {
  let allCollections: Category[] = [];

  try {
    allCollections = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name));
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
            Collections
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Build the Shop landing with collection cards and cover images.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 bg-[#E8A020] px-5 py-2.5 text-sm font-medium text-[#3D2E24] transition-colors hover:bg-[#d4911a]"
        >
          <PlusCircle size={18} />
          Add Collection
        </Link>
      </div>

      <div className="rounded border border-dashed border-[#E0D8CE] bg-white px-5 py-4 text-sm text-[#8A7D72]">
        <span className="font-medium text-[#3D2E24]">All Products</span> is created automatically on the storefront.
        Add the category collections here and assign products to them by using the same category name on each product.
      </div>

      {allCollections.length === 0 ? (
        <div className="border border-gray-100 bg-white p-16 text-center">
          <Layers3 size={36} className="mx-auto mb-4 text-[#E8A020]" />
          <p className="mb-4 text-gray-400">No collections yet.</p>
          <Link
            href="/admin/collections/new"
            className="inline-flex items-center gap-2 bg-[#3D2E24] px-6 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18]"
          >
            <PlusCircle size={18} />
            Add your first collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allCollections.map((collection) => (
            <div key={collection.id} className="overflow-hidden border border-gray-100 bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-gray-100">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No image yet
                  </div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-[#3D2E24]">
                      {collection.name}
                    </h2>
                    <p className="text-xs text-gray-400">{collection.slug}</p>
                  </div>
                  <span className="rounded bg-[#3D2E24]/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#3D2E24]">
                    Order {collection.sortOrder ?? 0}
                  </span>
                </div>

                {collection.description && (
                  <p className="text-sm text-[#8A7D72]">{collection.description}</p>
                )}

                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/collections/${collection.id}`}
                    className="p-1.5 text-gray-400 transition-colors hover:text-[#3D2E24]"
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteCollectionButton id={collection.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

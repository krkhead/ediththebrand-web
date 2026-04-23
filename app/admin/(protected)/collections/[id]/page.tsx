import CollectionForm from "@/components/admin/CollectionForm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let collection = null;
  try {
    const [found] = await db.select().from(categories).where(eq(categories.id, id));
    collection = found;
  } catch {
    // DB not configured
  }

  if (!collection) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/collections"
          className="mb-4 flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#3D2E24]"
        >
          <ChevronLeft size={16} />
          Back to Collections
        </Link>
        <h1
          className="text-4xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Edit Collection
        </h1>
        <p className="mt-1 text-sm text-gray-500">{collection.name}</p>
      </div>
      <CollectionForm collection={collection} mode="edit" />
    </div>
  );
}

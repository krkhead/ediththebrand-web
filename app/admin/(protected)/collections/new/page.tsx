import CollectionForm from "@/components/admin/CollectionForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewCollectionPage() {
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
          Add New Collection
        </h1>
      </div>
      <CollectionForm mode="new" />
    </div>
  );
}

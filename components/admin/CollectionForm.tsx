"use client";

import type { Category } from "@/lib/db/schema";
import { slugify } from "@/lib/shop-utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

interface CollectionFormProps {
  collection?: Category;
  mode: "new" | "edit";
}

export default function CollectionForm({
  collection,
  mode,
}: CollectionFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [image, setImage] = useState(collection?.image ?? "");
  const [sortOrder, setSortOrder] = useState(String(collection?.sortOrder ?? 0));

  const uploadToCloudinary = useCallback(async (file: File): Promise<string | null> => {
    const res = await fetch("/api/upload", { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to prepare image upload");
    }
    const { timestamp, signature, apiKey, cloudName, folder } = await res.json();

    const form = new FormData();
    form.append("file", file);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("api_key", apiKey);
    form.append("folder", folder);

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    if (!upload.ok) {
      const data = await upload.json().catch(() => ({}));
      throw new Error(data.error?.message || data.error || "Image upload failed");
    }
    const data = await upload.json();
    if (!data.secure_url) {
      throw new Error(data.error?.message || "Image upload failed");
    }
    return data.secure_url;
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      if (!uploadedUrl) {
        throw new Error("Upload failed");
      }
      setImage(uploadedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Collection image upload failed.");
      console.error(err);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        mode === "new" ? "/api/categories" : `/api/categories/${collection!.id}`,
        {
          method: mode === "new" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            slug: slugify(name),
            description,
            image,
            sortOrder: Number(sortOrder || 0),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save collection");
      }

      router.push("/admin/collections");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-5 border border-gray-100 bg-white p-6 shadow-sm">
        <h2
          className="text-2xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Collection Details
        </h2>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Collection Name *</label>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
            placeholder="e.g. Serum"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full resize-none border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
            placeholder="A short description for the collection card and header."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Sort Order</label>
            <p className="text-xs text-gray-400">
              Lower numbers appear first on the Shop collections page. Use 1, 2, 3 to control the order.
            </p>
            <input
              type="number"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border border-gray-100 bg-white p-6 shadow-sm">
        <h2
          className="text-2xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Collection Image
        </h2>
        <p className="text-xs text-gray-400">
          This image represents the collection on the Shop landing page.
        </p>

        {image && (
          <div className="group relative h-48 overflow-hidden bg-gray-100">
            <Image src={image} alt={name || "Collection image"} fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <label
          className={`flex items-center gap-3 border-2 border-dashed p-6 transition-colors ${
            uploadingImage
              ? "cursor-wait border-[#E8A020]"
              : "cursor-pointer border-gray-200 hover:border-[#E8A020]"
          }`}
        >
          <Upload size={20} className="flex-shrink-0 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              {uploadingImage ? "Uploading, please wait..." : "Click to upload image"}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 10MB</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploadingImage}
            className="hidden"
          />
          {uploadingImage && (
            <Loader2 size={18} className="ml-auto animate-spin text-[#E8A020]" />
          )}
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="flex items-center gap-2 bg-[#3D2E24] px-8 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {mode === "new" ? "Add Collection" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/collections")}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

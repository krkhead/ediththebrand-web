"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import type { Category, Product } from "@/lib/db/schema";
import { placeholderCollections } from "@/lib/storefront-data";
import { slugify } from "@/lib/shop-utils";
import { PRODUCT_CATEGORY_OPTIONS } from "@/lib/product-config";

interface ProductFormProps {
  product?: Product;
  mode: "new" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [availableCollections, setAvailableCollections] = useState<Category[]>(
    placeholderCollections
  );

  const existingCategory = product?.category ?? "";
  const existingIsPreset = PRODUCT_CATEGORY_OPTIONS.includes(
    existingCategory as (typeof PRODUCT_CATEGORY_OPTIONS)[number]
  );

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [categoryOption, setCategoryOption] = useState(
    existingCategory ? (existingIsPreset ? existingCategory : "Other") : ""
  );
  const [customCategory, setCustomCategory] = useState(
    existingCategory && !existingIsPreset ? existingCategory : ""
  );
  const [collectionSlug, setCollectionSlug] = useState(product?.collectionSlug ?? "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? false);
  const [isBackInStock, setIsBackInStock] = useState(product?.isBackInStock ?? false);
  const [images, setImages] = useState<string[]>(
    ((product?.images as string[]) ?? []).filter(Boolean)
  );

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) return;
        const data = (await response.json()) as Category[];
        if (data.length > 0) {
          setAvailableCollections(data);
        }
      } catch {
        // fall back to local placeholder collections
      }
    };

    void loadCollections();
  }, []);

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
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadingImages(true);
    setError("");
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      const valid = urls.filter((url): url is string => Boolean(url));
      if (valid.length < files.length) {
        setError("Some images could not be uploaded. The valid ones were saved.");
      }
      setImages((prev) => [...prev, ...valid]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
      console.error(err);
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    const slug = product?.slug ?? slugify(name);
    const finalCategory =
      categoryOption === "Other"
        ? customCategory.trim()
        : categoryOption.trim();

    const payload = {
      name,
      slug,
      description,
      price: price ? String(price) : null,
      images,
      category: finalCategory || null,
      collectionSlug: collectionSlug || null,
      inStock,
      featured,
      isNewArrival,
      isBackInStock,
    };

    try {
      const url = mode === "new" ? "/api/products" : `/api/products/${product!.id}`;
      const method = mode === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
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
          Product Details
        </h2>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Product Name *</label>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
            placeholder="e.g. Numbuzin 9+ Glow Set"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full resize-none border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
            placeholder="Write the full product description here."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Price (₦)</label>
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
              placeholder="Leave blank -> DM for price"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Product Category</label>
            <select
              value={categoryOption}
              onChange={(event) => setCategoryOption(event.target.value)}
              className="w-full border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
            >
              <option value="">Select category...</option>
              {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {categoryOption === "Other" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Custom Category</label>
            <input
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
              placeholder="Enter a custom category"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Collection</label>
          <select
            value={collectionSlug}
            onChange={(event) => setCollectionSlug(event.target.value)}
            className="w-full border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
          >
            <option value="">Select collection...</option>
            {availableCollections.map((collection) => (
              <option key={collection.id} value={collection.slug}>
                {collection.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400">
            Collections decide where the product appears on the Shop page. Categories are used for filtering.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 pt-2">
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setInStock(!inStock)}
              className={`h-5 w-10 rounded-full transition-colors ${
                inStock ? "bg-[#2C7A2C]" : "bg-gray-300"
              }`}
            >
              <span
                className={`mt-0.5 block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  inStock ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">In Stock</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setFeatured(!featured)}
              className={`h-5 w-10 rounded-full transition-colors ${
                featured ? "bg-[#E8A020]" : "bg-gray-300"
              }`}
            >
              <span
                className={`mt-0.5 block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  featured ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">Featured on Home</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setIsNewArrival(!isNewArrival)}
              className={`h-5 w-10 rounded-full transition-colors ${
                isNewArrival ? "bg-[#A14D2A]" : "bg-gray-300"
              }`}
            >
              <span
                className={`mt-0.5 block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isNewArrival ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">Show “New Arrival” on Home</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setIsBackInStock(!isBackInStock)}
              className={`h-5 w-10 rounded-full transition-colors ${
                isBackInStock ? "bg-[#7A5C43]" : "bg-gray-300"
              }`}
            >
              <span
                className={`mt-0.5 block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isBackInStock ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">Show “Back in Stock” on Home</span>
          </label>
        </div>
      </div>

      <div className="space-y-4 border border-gray-100 bg-white p-6 shadow-sm">
        <h2
          className="text-2xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Product Images
        </h2>
        <p className="text-xs text-gray-400">
          The first image becomes the main product image.
        </p>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url, index) => (
              <div key={`${index}-${url}`} className="group relative h-24 w-24">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-[#E8A020] py-0.5 text-center text-[8px] font-bold text-[#3D2E24]">
                    MAIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          className={`flex items-center gap-3 border-2 border-dashed p-6 transition-colors ${
            uploadingImages
              ? "cursor-wait border-[#E8A020]"
              : "cursor-pointer border-gray-200 hover:border-[#E8A020]"
          }`}
        >
          <Upload size={20} className="flex-shrink-0 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              {uploadingImages ? "Uploading, please wait..." : "Click to upload images"}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP - Max 10MB each</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploadingImages}
            className="hidden"
          />
          {uploadingImages && (
            <Loader2 size={18} className="ml-auto animate-spin text-[#E8A020]" />
          )}
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploadingImages}
          className="flex items-center gap-2 bg-[#3D2E24] px-8 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {mode === "new" ? "Add Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

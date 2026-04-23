"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ProductSort } from "@/lib/shop-utils";

interface CollectionControlsProps {
  basePath: string;
  initialQuery: string;
  initialSort: ProductSort;
  initialCategory?: string;
  categories?: string[];
}

export default function CollectionControls({
  basePath,
  initialQuery,
  initialSort,
  initialCategory,
  categories = [],
}: CollectionControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<ProductSort>(initialSort);
  const [category, setCategory] = useState(initialCategory ?? "");

  const applyFilters = (nextQuery = query, nextSort = sort, nextCategory = category) => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextSort !== "newest") params.set("sort", nextSort);
    if (nextCategory) params.set("category", nextCategory);

    const search = params.toString();
    router.push(search ? `${basePath}?${search}` : basePath);
  };

  return (
    <div className="grid gap-3 md:grid-cols-[1.2fr_220px_220px]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(() => applyFilters());
        }}
        className="flex items-center gap-3 border border-[#E0D8CE] bg-white px-4 py-3"
      >
        <Search size={18} className="text-[#8A7D72]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this collection"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#3D2E24] outline-none placeholder:text-[#8A7D72]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#E8A020] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#3D2E24] transition-colors hover:bg-[#d4911a]"
        >
          Search
        </button>
      </form>

      <label className="border border-[#E0D8CE] bg-white px-4 py-3 text-sm text-[#8A7D72]">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.2em]">
          Sort
        </span>
        <select
          value={sort}
          onChange={(event) => {
            const nextSort = event.target.value as ProductSort;
            setSort(nextSort);
            startTransition(() => applyFilters(query, nextSort, category));
          }}
          className="w-full bg-transparent text-[#3D2E24] outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name-asc">Name A–Z</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </label>

      {categories.length > 0 ? (
        <label className="border border-[#E0D8CE] bg-white px-4 py-3 text-sm text-[#8A7D72]">
          <span className="mb-1 block text-[10px] uppercase tracking-[0.2em]">
            Category
          </span>
          <select
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              setCategory(nextCategory);
              startTransition(() => applyFilters(query, sort, nextCategory));
            }}
            className="w-full bg-transparent text-[#3D2E24] outline-none"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="border border-[#E0D8CE] bg-[#F8F4EE] px-4 py-3 text-sm text-[#8A7D72]">
          This collection uses its own focused product list.
        </div>
      )}
    </div>
  );
}

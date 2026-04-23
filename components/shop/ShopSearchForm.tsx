"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface ShopSearchFormProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export default function ShopSearchForm({
  initialQuery = "",
  placeholder = "Search for serums, toners, sunscreens...",
  className = "",
}: ShopSearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = query.trim();

    startTransition(() => {
      if (!trimmed) {
        router.push("/shop");
        return;
      }

      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex items-center gap-3 border border-[#E0D8CE] bg-white/95 px-4 py-3 shadow-[0_20px_60px_rgba(61,46,36,0.12)] backdrop-blur-sm">
        <Search size={18} className="text-[#8A7D72]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#3D2E24] outline-none placeholder:text-[#8A7D72]"
          aria-label="Search products"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 bg-[#E8A020] px-4 py-2 text-xs font-medium tracking-[0.2em] text-[#3D2E24] uppercase transition-colors hover:bg-[#d4911a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Search
        </button>
      </div>
    </form>
  );
}

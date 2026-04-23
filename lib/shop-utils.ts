import type { CouponDefinition } from "@/lib/shop-config";
import type { Category, Product } from "@/lib/db/schema";
import { FALLBACK_COUPON_DEFINITIONS } from "@/lib/shop-config";
import { ALL_PRODUCTS_COLLECTION_SLUG } from "@/lib/storefront-data";

export type ProductSort =
  | "newest"
  | "oldest"
  | "name-asc"
  | "price-asc"
  | "price-desc";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function normalizeCode(value: string) {
  return value.trim().toUpperCase();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveCoupon(
  code: string,
  coupons: CouponDefinition[] = FALLBACK_COUPON_DEFINITIONS
): CouponDefinition | null {
  const normalized = normalize(code);
  return (
    coupons.find((coupon) => normalize(coupon.code) === normalized) ?? null
  );
}

export function getCouponDiscount(
  subtotal: number,
  coupon: CouponDefinition | null
) {
  if (!coupon || subtotal <= 0) return 0;

  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }

  return Math.min(subtotal, coupon.value);
}

export function matchesProductQuery(product: Product, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  return [product.name, product.description, product.category, product.origin]
    .filter((value): value is string => Boolean(value))
    .some((value) => normalize(value).includes(normalizedQuery));
}

export function getProductStatusBadges(product: Product) {
  const badges: string[] = [];

  if (product.isNewArrival) badges.push("New Arrival");
  if (product.isBackInStock) badges.push("Back in Stock");

  return badges;
}

export function sortProducts(products: Product[], sort: ProductSort) {
  const items = [...products];

  items.sort((left, right) => {
    if (sort === "oldest") {
      return (
        new Date(left.createdAt ?? 0).getTime() -
        new Date(right.createdAt ?? 0).getTime()
      );
    }

    if (sort === "name-asc") {
      return left.name.localeCompare(right.name);
    }

    if (sort === "price-asc") {
      return (parseFloat(left.price ?? "0") || 0) - (parseFloat(right.price ?? "0") || 0);
    }

    if (sort === "price-desc") {
      return (parseFloat(right.price ?? "0") || 0) - (parseFloat(left.price ?? "0") || 0);
    }

    return (
      new Date(right.createdAt ?? 0).getTime() -
      new Date(left.createdAt ?? 0).getTime()
    );
  });

  return items;
}

export function paginateItems<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * perPage;

  return {
    currentPage,
    totalPages,
    items: items.slice(startIndex, startIndex + perPage),
  };
}

export function buildCollectionHref(
  collectionSlug: string,
  params: Record<string, string | undefined>
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `/shop/${collectionSlug}?${query}` : `/shop/${collectionSlug}`;
}

export function getAllCategoriesForFilter(products: Product[], collections: Category[]) {
  const categoryNames =
    collections.length > 0
      ? collections.map((collection) => collection.name)
      : products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category));

  return [...new Set(categoryNames)];
}

export function isAllProductsCollection(slug: string) {
  return slug === ALL_PRODUCTS_COLLECTION_SLUG;
}

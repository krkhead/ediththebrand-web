import type { Product } from "@/lib/db/schema";
import {
  FALLBACK_COUPON_DEFINITIONS,
  PRODUCT_SPOTLIGHTS,
  type CouponDefinition,
} from "@/lib/shop-config";

export type ProductSpotlightKey = "new-arrivals" | "back-in-stock";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function normalizeCode(value: string) {
  return value.trim().toUpperCase();
}

export function resolveCoupon(
  code: string,
  coupons: CouponDefinition[] = FALLBACK_COUPON_DEFINITIONS
): CouponDefinition | null {
  const normalized = normalize(code);
  return (
    coupons.find((coupon) => normalize(coupon.code) === normalized) ??
    null
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

export function getProductSpotlights(products: Product[]) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));

  const newArrivals = PRODUCT_SPOTLIGHTS.newArrivals
    .map((slug) => bySlug.get(slug))
    .filter((product): product is Product => Boolean(product));

  const backInStock = PRODUCT_SPOTLIGHTS.backInStock
    .map((slug) => bySlug.get(slug))
    .filter((product): product is Product => Boolean(product));

  const fallbackNewArrivals =
    newArrivals.length > 0
      ? newArrivals
      : [...products]
          .sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          )
          .slice(0, 4);

  const fallbackBackInStock =
    backInStock.length > 0
      ? backInStock
      : products
          .filter((product) => product.inStock)
          .sort(
            (a, b) =>
              new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
              new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
          )
          .slice(0, 4);

  return {
    "new-arrivals": fallbackNewArrivals,
    "back-in-stock": fallbackBackInStock,
  } satisfies Record<ProductSpotlightKey, Product[]>;
}

export function getProductBadges(
  product: Product,
  spotlightMap: Record<ProductSpotlightKey, Product[]>
) {
  const badges: string[] = [];

  if (spotlightMap["new-arrivals"].some((item) => item.slug === product.slug)) {
    badges.push("New Arrival");
  }

  if (spotlightMap["back-in-stock"].some((item) => item.slug === product.slug)) {
    badges.push("Back in Stock");
  }

  return badges;
}

export function matchesProductQuery(product: Product, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  return [product.name, product.description, product.category, product.origin]
    .filter((value): value is string => Boolean(value))
    .some((value) => normalize(value).includes(normalizedQuery));
}

export function buildShopHref(params: {
  category?: string;
  query?: string;
  spotlight?: ProductSpotlightKey;
}) {
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set("category", params.category);
  if (params.query) searchParams.set("q", params.query);
  if (params.spotlight) searchParams.set("spotlight", params.spotlight);

  const queryString = searchParams.toString();
  return queryString ? `/shop?${queryString}` : "/shop";
}

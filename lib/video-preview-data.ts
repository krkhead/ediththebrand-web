import type { Category, Product, Review } from "@/lib/db/schema";

export const VIDEO_PREVIEW_KEY = "video";

export const videoPreviewCollections: Category[] = [
  {
    id: "vp-c1",
    name: "Radiance",
    slug: "radiance",
    description:
      "Brightening essentials that help skin look clear, even-toned and luminous.",
    image: "/brand/IMG_1549.JPG.jpeg",
    sortOrder: 1,
  },
  {
    id: "vp-c2",
    name: "Barrier Care",
    slug: "barrier-care",
    description:
      "Comforting hydration and repair-focused formulas for stressed or sensitive skin.",
    image: "/brand/IMG_9850.JPG.jpeg",
    sortOrder: 2,
  },
  {
    id: "vp-c3",
    name: "Body Ritual",
    slug: "body-ritual",
    description:
      "Softening body care staples for smooth texture, glow and long-lasting moisture.",
    image: "/brand/IMG_3841.JPG.jpeg",
    sortOrder: 3,
  },
];

export const videoPreviewProducts: Product[] = [
  {
    id: "vp-p1",
    slug: "glass-skin-essence",
    name: "Glass Skin Essence",
    description:
      "A glow-boosting essence layered with niacinamide, rice ferment and hydration support for an instantly fresher finish.",
    price: "28500",
    images: ["/brand/IMG_6389.JPG.jpeg"],
    origin: "KR",
    category: "Serums",
    collectionSlug: "radiance",
    inStock: true,
    featured: true,
    isNewArrival: true,
    isBackInStock: false,
    createdAt: new Date("2026-04-20"),
    updatedAt: new Date("2026-04-20"),
  },
  {
    id: "vp-p2",
    slug: "daily-milk-cleanser",
    name: "Daily Milk Cleanser",
    description:
      "A creamy low-stripping cleanser that removes buildup gently while keeping skin soft and calm.",
    price: "21500",
    images: ["/brand/IMG_4709.JPG.jpeg"],
    origin: "UK",
    category: "Cleanser/Face Wash",
    collectionSlug: "barrier-care",
    inStock: true,
    featured: true,
    isNewArrival: false,
    isBackInStock: true,
    createdAt: new Date("2026-04-12"),
    updatedAt: new Date("2026-04-22"),
  },
  {
    id: "vp-p3",
    slug: "velvet-body-cream",
    name: "Velvet Body Cream",
    description:
      "A rich but fast-absorbing body cream designed to smooth dry areas and leave skin with a healthy satin glow.",
    price: "24000",
    images: ["/brand/IMG_3841.JPG.jpeg"],
    origin: "US",
    category: "Body Care",
    collectionSlug: "body-ritual",
    inStock: true,
    featured: true,
    isNewArrival: true,
    isBackInStock: false,
    createdAt: new Date("2026-04-18"),
    updatedAt: new Date("2026-04-18"),
  },
  {
    id: "vp-p4",
    slug: "barrier-cloud-cream",
    name: "Barrier Cloud Cream",
    description:
      "A cushiony moisturizer with ceramides and panthenol to help restore comfort and reduce that tight post-cleansing feel.",
    price: "32000",
    images: ["/brand/IMG_9850.JPG.jpeg"],
    origin: "JP",
    category: "Moisturizer",
    collectionSlug: "barrier-care",
    inStock: true,
    featured: false,
    isNewArrival: false,
    isBackInStock: true,
    createdAt: new Date("2026-04-08"),
    updatedAt: new Date("2026-04-21"),
  },
];

export const videoPreviewReviews: Review[] = [
  {
    id: "vp-r1",
    productId: "vp-p1",
    customerName: "Amara",
    rating: 5,
    review:
      "My skin looked brighter within days and the texture is so elegant under the rest of my routine.",
    createdAt: new Date("2026-04-23"),
  },
  {
    id: "vp-r2",
    productId: "vp-p1",
    customerName: "Teni",
    rating: 5,
    review:
      "It gives that healthy glass-skin finish without feeling sticky. Easily one of my favourite steps.",
    createdAt: new Date("2026-04-24"),
  },
];

export function isVideoPreviewEnabled(value: string | string[] | undefined) {
  return value === VIDEO_PREVIEW_KEY;
}

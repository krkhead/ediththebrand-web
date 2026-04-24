export const PRODUCT_CATEGORY_OPTIONS = [
  "Body Care",
  "Sunscreen",
  "Toner",
  "Moisturizer",
  "Cleanser/Face Wash",
  "Treatment",
  "Serums",
  "Other",
] as const;

export type ProductCategoryOption = (typeof PRODUCT_CATEGORY_OPTIONS)[number];

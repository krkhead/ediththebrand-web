import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, type NewProduct } from "@/lib/db/schema";
import { and, eq, SQL } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";

const ALLOWED_CREATE_FIELDS = new Set([
  "name", "slug", "description", "price", "images",
  "category", "origin", "inStock", "featured",
  "isNewArrival", "isBackInStock",
]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const conditions: SQL[] = [];
    if (category) conditions.push(eq(products.category, category));
    if (featured === "true") conditions.push(eq(products.featured, true));

    const result = await db
      .select()
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.error;

  try {
    const body = await request.json();

    const sanitized = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_CREATE_FIELDS.has(key))
    );

    const { name, slug } = sanitized as { name?: string; slug?: string };
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const [product] = await db
      .insert(products)
      .values(sanitized as NewProduct)
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

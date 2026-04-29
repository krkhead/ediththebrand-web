import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";
import { placeholderCollections } from "@/lib/storefront-data";
import { slugify } from "@/lib/shop-utils";

const ALLOWED_CREATE_FIELDS = new Set([
  "name",
  "slug",
  "description",
  "image",
  "sortOrder",
]);

export async function GET() {
  try {
    const result = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(placeholderCollections);
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

    const name = String(sanitized.name ?? "").trim();
    const slug = slugify(String(sanitized.slug ?? name));

    if (!name || !slug || slug === "all-products") {
      return NextResponse.json(
        { error: "Collection name and a valid slug are required" },
        { status: 400 }
      );
    }

    const [collection] = await db
      .insert(categories)
      .values({
        ...sanitized,
        name,
        slug,
        description: String(sanitized.description ?? "").trim() || null,
        image: String(sanitized.image ?? "").trim() || null,
        sortOrder: Number(sanitized.sortOrder ?? 0),
      })
      .returning();

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    const message =
      error instanceof Error && /does not exist|column|relation/i.test(error.message)
        ? "Database schema needs updating. Run npm run db:push once, then try again."
        : "Failed to create collection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

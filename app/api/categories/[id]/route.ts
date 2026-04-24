import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { isValidUUID, requireAdmin } from "@/lib/admin-guard";
import { slugify } from "@/lib/shop-utils";

const ALLOWED_UPDATE_FIELDS = new Set([
  "name",
  "slug",
  "description",
  "image",
  "sortOrder",
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 });
    }

    const [collection] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.error;

  try {
    const { id } = await params;
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 });
    }

    const body = await request.json();
    const sanitized = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_UPDATE_FIELDS.has(key))
    );

    if ("name" in sanitized) sanitized.name = String(sanitized.name ?? "").trim();
    if ("slug" in sanitized || sanitized.name) {
      sanitized.slug = slugify(String(sanitized.slug ?? sanitized.name ?? ""));
    }
    if ("description" in sanitized) {
      sanitized.description = String(sanitized.description ?? "").trim() || null;
    }
    if ("image" in sanitized) {
      sanitized.image = String(sanitized.image ?? "").trim() || null;
    }
    if ("sortOrder" in sanitized) {
      sanitized.sortOrder = Number(sanitized.sortOrder ?? 0);
    }

    if (sanitized.slug === "all-products") {
      return NextResponse.json({ error: "This slug is reserved" }, { status: 400 });
    }

    if (sanitized.slug) {
      const [existing] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(and(eq(categories.slug, sanitized.slug as string), ne(categories.id, id)));

      if (existing) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(categories)
      .set(sanitized)
      .where(eq(categories.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/categories/[id] error:", error);
    const message =
      error instanceof Error && /does not exist|column|relation/i.test(error.message)
        ? "Database schema needs updating. Run npm run db:push once, then try again."
        : "Failed to update collection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.error;

  try {
    const { id } = await params;
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid collection ID" }, { status: 400 });
    }

    await db.delete(categories).where(eq(categories.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}

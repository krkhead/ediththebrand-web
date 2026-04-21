import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const ALLOWED_UPDATE_FIELDS = new Set([
  "name", "slug", "description", "price", "images",
  "category", "origin", "inStock", "featured",
]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const sanitized = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_UPDATE_FIELDS.has(key))
    );

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    if (sanitized.slug) {
      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, sanitized.slug as string), ne(products.id, id)));
      if (existing) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(products)
      .set(sanitized)
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

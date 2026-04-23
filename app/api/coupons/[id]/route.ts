import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { requireAdmin, isValidUUID } from "@/lib/admin-guard";
import { normalizeCode } from "@/lib/shop-utils";

const ALLOWED_UPDATE_FIELDS = new Set(["code", "type", "value", "label", "active"]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid coupon ID" }, { status: 400 });
    }

    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("GET /api/coupons/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid coupon ID" }, { status: 400 });
    }

    const body = await request.json();
    const sanitized = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_UPDATE_FIELDS.has(key))
    );

    if ("code" in sanitized) sanitized.code = normalizeCode(String(sanitized.code ?? ""));
    if ("label" in sanitized) sanitized.label = String(sanitized.label ?? "").trim();
    if ("value" in sanitized) sanitized.value = Math.round(Number(sanitized.value));

    if ("type" in sanitized) {
      const type = sanitized.type;
      if (type !== "percent" && type !== "fixed") {
        return NextResponse.json({ error: "Invalid coupon type" }, { status: 400 });
      }
    }

    if ("value" in sanitized) {
      const value = Number(sanitized.value);
      if (!Number.isFinite(value) || value <= 0) {
        return NextResponse.json({ error: "Value must be greater than 0" }, { status: 400 });
      }

      const nextType =
        (sanitized.type as "percent" | "fixed" | undefined) ??
        (
          await db
            .select({ type: coupons.type })
            .from(coupons)
            .where(eq(coupons.id, id))
            .then((rows) => rows[0]?.type)
        );

      if (nextType === "percent" && value > 100) {
        return NextResponse.json({ error: "Percent coupons cannot exceed 100" }, { status: 400 });
      }
    }

    if (sanitized.code) {
      const [existing] = await db
        .select({ id: coupons.id })
        .from(coupons)
        .where(and(eq(coupons.code, sanitized.code as string), ne(coupons.id, id)));

      if (existing) {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(coupons)
      .set(sanitized)
      .where(eq(coupons.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/coupons/[id] error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid coupon ID" }, { status: 400 });
    }

    await db.delete(coupons).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/coupons/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}

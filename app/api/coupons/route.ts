import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, type NewCoupon } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";
import { FALLBACK_COUPON_DEFINITIONS } from "@/lib/shop-config";
import { normalizeCode } from "@/lib/shop-utils";

const ALLOWED_CREATE_FIELDS = new Set([
  "code",
  "type",
  "value",
  "label",
  "active",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive") === "true";

  try {
    const result = await db
      .select({
        id: coupons.id,
        code: coupons.code,
        type: coupons.type,
        value: coupons.value,
        label: coupons.label,
        active: coupons.active,
        createdAt: coupons.createdAt,
        updatedAt: coupons.updatedAt,
      })
      .from(coupons)
      .where(includeInactive ? undefined : eq(coupons.active, true))
      .orderBy(asc(coupons.code));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/coupons error:", error);

    if (!includeInactive) {
      return NextResponse.json(
        FALLBACK_COUPON_DEFINITIONS.map((coupon, index) => ({
          id: `fallback-${index}`,
          ...coupon,
          active: true,
          createdAt: null,
          updatedAt: null,
        }))
      );
    }

    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
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

    const code = normalizeCode(String(sanitized.code ?? ""));
    const label = String(sanitized.label ?? "").trim();
    const type = sanitized.type;
    const value = Number(sanitized.value);

    if (!code || !label || (type !== "percent" && type !== "fixed")) {
      return NextResponse.json({ error: "Code, label and type are required" }, { status: 400 });
    }

    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json({ error: "Value must be greater than 0" }, { status: 400 });
    }

    if (type === "percent" && value > 100) {
      return NextResponse.json({ error: "Percent coupons cannot exceed 100" }, { status: 400 });
    }

    const [coupon] = await db
      .insert(coupons)
      .values({
        ...(sanitized as NewCoupon),
        code,
        label,
        type,
        value: Math.round(value),
      })
      .returning();

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("POST /api/coupons error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

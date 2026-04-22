import { NextResponse } from "next/server";
import { getSignedUploadParams } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST() {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.error;

  try {
    const params = await getSignedUploadParams();
    return NextResponse.json(params);
  } catch (error) {
    console.error("Upload sign error:", error);
    return NextResponse.json({ error: "Failed to generate upload params" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSignedUploadParams } from "@/lib/cloudinary";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await getSignedUploadParams();
    return NextResponse.json(params);
  } catch (error) {
    console.error("Upload sign error:", error);
    return NextResponse.json({ error: "Failed to generate upload params" }, { status: 500 });
  }
}

import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  clerkRuntime,
  getClerkDisabledMessage,
} from "@/lib/clerk-config";

export async function requireAdmin(): Promise<
  | { authorized: true; error?: undefined }
  | { authorized: false; error: NextResponse }
> {
  const adminSession = await getAdminSessionFromCookies();
  if (adminSession) {
    return { authorized: true };
  }

  if (!clerkRuntime.enabled) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: getClerkDisabledMessage() },
        { status: 503 }
      ),
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      authorized: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await currentUser();
  const email = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  if (email !== ADMIN_EMAIL) {
    return {
      authorized: false,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { authorized: true };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(id: string): boolean {
  return UUID_RE.test(id);
}

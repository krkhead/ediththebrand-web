import { NextResponse } from "next/server";
import {
  adminAuth,
  createAdminSessionValue,
  getAdminAuthDisabledReason,
  getAdminSessionCookieOptions,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { clerkRuntime } from "@/lib/clerk-config";

export async function POST(request: Request) {
  if (!adminAuth.enabled) {
    return NextResponse.redirect(
      new URL(
        clerkRuntime.enabled
          ? "/admin/sign-in"
          : `/admin/sign-in?error=${encodeURIComponent(
              getAdminAuthDisabledReason() ?? "Admin auth is unavailable."
            )}`,
        request.url
      )
    );
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // Constant-time delay limits brute-force to ~2 attempts/sec without extra deps.
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.redirect(
      new URL("/admin/sign-in?error=Invalid%20email%20or%20password.", request.url)
    );
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(
    adminAuth.cookieName,
    createAdminSessionValue(email),
    getAdminSessionCookieOptions()
  );
  return response;
}

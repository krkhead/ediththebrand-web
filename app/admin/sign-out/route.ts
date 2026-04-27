import { NextResponse } from "next/server";
import { adminAuth, getAdminSessionCookieOptions } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/sign-in", request.url));
  response.cookies.set(adminAuth.cookieName, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}

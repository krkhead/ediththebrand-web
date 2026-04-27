import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { adminAuth, getAdminSessionFromRequest } from "@/lib/admin-auth-edge";
import { clerkRuntime } from "@/lib/clerk-config";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminSignIn = createRouteMatcher(["/admin/sign-in(.*)", "/admin/session"]);

const clerkProxy = clerkMiddleware(async (auth, req) => {
  // Allow the sign-in page through unauthenticated
  if (isAdminSignIn(req)) return NextResponse.next();

  // All other /admin/* routes require an active session at the edge
  // (email restriction is the second layer inside layout.tsx)
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (adminAuth.enabled) {
    const session = await getAdminSessionFromRequest(request);

    if (isAdminSignIn(request) && session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (isAdminRoute(request) && !isAdminSignIn(request) && !session) {
      return NextResponse.redirect(new URL("/admin/sign-in", request.url));
    }

    return NextResponse.next();
  }

  if (!clerkRuntime.enabled) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

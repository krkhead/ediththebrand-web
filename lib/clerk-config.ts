const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? "";
const secretKey = process.env.CLERK_SECRET_KEY?.trim() ?? "";

const isVercelProduction = process.env.VERCEL_ENV === "production";
const hasClerkKeys = publishableKey.length > 0 && secretKey.length > 0;
const hasLiveClerkKeys =
  publishableKey.startsWith("pk_live_") && secretKey.startsWith("sk_live_");

export const ADMIN_EMAIL = "editholufestus@gmail.com";

export const clerkRuntime = {
  publishableKey,
  secretKey,
  hasClerkKeys,
  hasLiveClerkKeys,
  enabled: hasClerkKeys && (!isVercelProduction || hasLiveClerkKeys),
  reason: !hasClerkKeys
    ? "Missing Clerk environment keys."
    : isVercelProduction && !hasLiveClerkKeys
      ? "Production deployments require Clerk live keys."
      : null,
} as const;

export function getClerkDisabledMessage() {
  return clerkRuntime.reason ?? "Clerk authentication is unavailable.";
}

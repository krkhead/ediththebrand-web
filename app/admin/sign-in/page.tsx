import { Show, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { adminAuth, getAdminSessionFromCookies } from "@/lib/admin-auth";
import { clerkRuntime, getClerkDisabledMessage } from "@/lib/clerk-config";

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const adminSession = await getAdminSessionFromCookies();
  if (adminSession) redirect("/admin");
  if (!adminAuth.enabled && clerkRuntime.enabled) {
    const { userId } = await auth();
    if (userId) redirect("/admin");
  }

  const error = searchParams ? (await searchParams).error : undefined;

  return (
    <div className="min-h-screen bg-[#3D2E24] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/brand/logo.png"
            alt="Ediththebrand"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <p
              className="text-3xl text-[#E8A020]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Admin Access
            </p>
            <p className="text-[#8A7D72] text-sm mt-1">Ediththebrand</p>
          </div>
        </div>

        {adminAuth.enabled ? (
          <form action="/admin/session" method="post" className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs tracking-widest uppercase text-[#8A7D72]">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-[#5A4535] bg-[#2A1F18] px-4 py-3 text-sm text-[#F8F4EE] outline-none focus:border-[#E8A020]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs tracking-widest uppercase text-[#8A7D72]">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full border border-[#5A4535] bg-[#2A1F18] px-4 py-3 text-sm text-[#F8F4EE] outline-none focus:border-[#E8A020]"
                required
              />
            </div>
            <button className="w-full bg-[#E8A020] text-[#3D2E24] py-3 text-sm font-medium tracking-wide hover:bg-[#d4911a] transition-colors">
              Sign In to Admin
            </button>
            {error && (
              <p className="text-sm text-red-300">{error}</p>
            )}
          </form>
        ) : clerkRuntime.enabled ? (
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/admin">
              <button className="w-full bg-[#E8A020] text-[#3D2E24] py-3 text-sm font-medium tracking-wide hover:bg-[#d4911a] transition-colors">
                Sign In to Admin
              </button>
            </SignInButton>
          </Show>
        ) : (
          <div className="space-y-3 border border-[#5A4535] bg-[#2A1F18] px-5 py-4 text-left">
            <p className="text-sm font-medium text-[#F8F4EE]">
              Admin sign-in is temporarily unavailable.
            </p>
            <p className="text-sm leading-relaxed text-[#8A7D72]">
              {getClerkDisabledMessage()}
            </p>
          </div>
        )}

        <p className="text-[#8A7D72] text-xs">
          Admin access only. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
}

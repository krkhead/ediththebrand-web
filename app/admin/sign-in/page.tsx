import { Show, SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function AdminSignInPage() {
  // Already signed in? Go straight to admin
  const { userId } = await auth();
  if (userId) redirect("/admin");

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

        {/* Sign in button */}
        <Show when="signed-out">
          <SignInButton mode="modal" forceRedirectUrl="/admin">
            <button className="w-full bg-[#E8A020] text-[#3D2E24] py-3 text-sm font-medium tracking-wide hover:bg-[#d4911a] transition-colors">
              Sign In to Admin
            </button>
          </SignInButton>
        </Show>

        <p className="text-[#8A7D72] text-xs">
          Admin access only. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
}

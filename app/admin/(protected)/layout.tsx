import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Package, PlusCircle, Home, TicketPercent, Layers3 } from "lucide-react";

const ADMIN_EMAIL = "editholufestus@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/admin/sign-in");
  }

  const user = await currentUser();
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  if (email !== ADMIN_EMAIL) {
    redirect("/admin/sign-in");
  }

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/collections", icon: Layers3, label: "Collections" },
    { href: "/admin/products/new", icon: PlusCircle, label: "Add Product" },
    { href: "/admin/coupons", icon: TicketPercent, label: "Coupons" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3D2E24] flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-[#5A4535]">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Ediththebrand"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <p
                className="text-[#E8A020] text-lg leading-none"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Ediththebrand
              </p>
              <p className="text-[#8A7D72] text-[10px] mt-0.5 tracking-widest">
                ADMIN
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#8A7D72] hover:text-[#F8F4EE] hover:bg-[#5A4535] transition-colors rounded-sm"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#5A4535] space-y-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-[#8A7D72] hover:text-[#F8F4EE] transition-colors"
          >
            <Home size={16} />
            View Site
          </Link>
          <div className="px-4">
            <UserButton
              appearance={{
                variables: { colorPrimary: "#E8A020" },
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

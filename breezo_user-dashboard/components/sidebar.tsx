"use client";
import type React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Tag,
  Users,
  Gift,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function Sidebar() {
  const router = useRouter();
  return (
    <div className="w-[220px] bg-white border-r flex flex-col ">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">Breezo</span>
        </Link>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutGrid className="h-5 w-5" />}
            label="Dashboard"
            active
            commingSoon={false}
          />

          <SidebarItem
            href="/referral"
            icon={<Users className="h-5 w-5" />}
            label="Referral Program"
            commingSoon={true}
          />
          {/* <SidebarItem
            href="/rewards"
            icon={<Gift className="h-5 w-5" />}
            label="Rewards"
            commingSoon={true}
          /> */}
        </nav>
      </div>

      <div className="p-4 border-t mt-auto fixed left-0 bottom-0">
        <button
          onClick={() => {
            Cookies.remove("token");
            router.push("/login");
          }}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  commingSoon: boolean;
}

function SidebarItem({
  href,
  icon,
  label,
  active,
  commingSoon,
}: SidebarItemProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 ${
        href === pathname ? "bg-gray-100 rounded-md" : ""
      }`}
    >
      <div className="mr-2">{icon}</div>
      <span>
        {label}
        {commingSoon && (
          <div className="ml-7 text-xs bg-gray-100 w-fit px-2 py-0.5 rounded mt-1">
            Coming Soon
          </div>
        )}
      </span>
    </Link>
  );
}

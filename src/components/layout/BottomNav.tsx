"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageCircle, User, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/discover", icon: Search, label: "Discover" },
  { href: "/matches", icon: Heart, label: "Matches" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around h-16 safe-area-pb">
      {links.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 text-xs font-medium transition-colors",
              active ? "text-rose-500" : "text-gray-400"
            )}
          >
            <Icon className={cn("w-6 h-6", active && "fill-rose-100")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

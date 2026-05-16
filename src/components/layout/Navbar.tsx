"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PawPrint, LogOut, Settings, User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100 items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-500">
        <PawPrint className="w-6 h-6" />
        PawMatch
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          <Link href="/discover" className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors">
            Discover
          </Link>
          <Link href="/matches" className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors">
            Matches
          </Link>
          <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors">
            My Pets
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-9 h-9">
                <AvatarImage src={session.user?.image ?? undefined} />
                <AvatarFallback className="bg-rose-100 text-rose-600">
                  {session.user?.name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> My Pets
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-red-500"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white">
          <Link href="/login">Get Started</Link>
        </Button>
      )}
    </nav>
  );
}

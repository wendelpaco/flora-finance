"use client";

import { Bell, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function UserHeader({ className }: { className?: string }) {
  // const { data: session } = useSession();

  return (
    <div
      className={cn(
        "hidden md:flex flex-wrap sm:flex-nowrap justify-end items-center px-2 sm:px-4 py-2 gap-2",
        className
      )}
    >
      <div className="flex gap-2 items-start sm:items-center">
        <Link href="/notificacoes">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white shadow border rounded-md cursor-pointer p-0">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </Badge>
          </div>
        </Link>

        <Link href="/configuracoes">
          <div className="w-10 h-10 flex items-center justify-center bg-white shadow border rounded-md cursor-pointer p-0">
            <Settings className="h-5 w-5" />
          </div>
        </Link>

        <Avatar className="w-10 h-10 border shadow bg-white rounded-md cursor-pointer flex items-center justify-center p-0">
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

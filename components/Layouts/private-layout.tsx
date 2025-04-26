"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import ToasterPrivate from "../Toaster/ToasterPrivate";
import { signOut } from "next-auth/react";
import { ITEMMENU } from "../../lib/item-menu";

export function PrivateLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Sidebar */}
      <ToasterPrivate />
      <aside
        className={clsx(
          "fixed z-40 inset-y-0 left-0 bg-white border-r shadow-sm transition-all duration-300 ease-in-out md:relative flex flex-col",
          isSidebarOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden"
        )}
      >
        <div
          className={clsx(
            "text-2xl font-bold text-emerald-600 transition-all mb-6",
            !isSidebarOpen && "text-sm"
          )}
        >
          {isSidebarOpen ? "Sintetix" : "S"}
        </div>
        <nav className="flex flex-col gap-2">
          {ITEMMENU.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;

            const commonClasses = clsx(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
              isActive
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md"
                : "text-gray-600 hover:bg-slate-100"
            );

            const iconClasses = clsx(
              "transition-all",
              isSidebarOpen ? "w-5 h-5" : "w-7 h-7"
            );

            return (
              <div key={label}>
                {label === "Sair" ? (
                  <button onClick={handleLogout} className={commonClasses}>
                    <Icon className={iconClasses} />
                    {isSidebarOpen && <span>{label}</span>}
                  </button>
                ) : href ? (
                  <Link href={href} className={commonClasses}>
                    <Icon className={iconClasses} />
                    {isSidebarOpen && <span>{label}</span>}
                  </Link>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>

      <div
        className={clsx(
          "absolute z-50 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "top-4 left-[270px]" : "top-4 left-4"
        )}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 rounded-full bg-white border-2 border-emerald-600 text-emerald-600 shadow-lg hover:rotate-90 hover:bg-emerald-50 transition-transform duration-500 ease-in-out"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? (
            <HiX className="w-4 h-4" />
          ) : (
            <HiMenuAlt2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 w-full min-h-screen p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

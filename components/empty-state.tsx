"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-muted-foreground py-10 px-4 rounded-lg bg-white/60 dark:bg-white/10",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-3xl text-emerald-600 dark:text-emerald-400">
          {icon}
        </div>
        <p className="text-sm">{message}</p>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

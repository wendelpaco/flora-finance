"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CardDashboardProps {
  title: string;
  value?: string;
  children?: ReactNode;
  positive?: boolean;
}

export function CardDashboard({
  title,
  value,
  children,
  positive,
}: CardDashboardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between min-h-[150px]">
      <h3 className="text-sm text-gray-500 font-semibold mb-2">{title}</h3>

      {children ? (
        <div className="flex-grow">{children}</div>
      ) : (
        <div className="flex items-center gap-2">
          {positive !== undefined &&
            (positive ? (
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            ))}
          <span className="text-2xl font-bold text-gray-800">{value}</span>
        </div>
      )}
    </div>
  );
}

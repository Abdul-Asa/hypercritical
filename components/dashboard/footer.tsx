"use client";

import { Badge } from "@/components/ui/badge";
import { Logo } from "../layout/logo";

export function Footer() {
  return (
    <div className="flex items-center justify-between border-t bg-card p-6 ">
      <Logo />
      <Badge
        variant="outline"
        className="bg-green-500/10 text-green-400 border-green-500/30 font-mono"
      >
        OPERATIONAL
        <span className="relative ml-auto flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
        </span>
      </Badge>
    </div>
  );
}

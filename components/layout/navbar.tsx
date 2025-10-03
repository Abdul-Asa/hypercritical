"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Logo } from "./logo";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

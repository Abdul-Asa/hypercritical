"use client";

import { ModeToggle } from "./mode-toggle";
import { Logo } from "./logo";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 border-b bg-card">
      <div className="flex h-20 items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center relative group"
      style={{ width: "160px", height: "36px" }}
    >
      <div
        className="flex-shrink-0 absolute"
        aria-hidden="true"
        style={{
          imageRendering: "pixelated",
          top: "8px",
          left: "3px",
          width: "132px",
          height: "24px",
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-xl font-bold text-foreground/90 group-hover:text-foreground transition-colors duration-200">
            ASA
          </span>
        </div>
      </div>

      <div
        className="flex-shrink-0 absolute opacity-100 transition-transform duration-300 group-hover:-translate-y-1  "
        aria-hidden="true"
        style={{
          imageRendering: "pixelated",
          top: "6px",
          left: "138px",
          width: "11px",
          height: "9px",
        }}
      >
        <svg
          viewBox="0 0 11.043 8.834"
          className="w-full h-full text-foreground/90 group-hover:text-foreground transition-colors duration-200"
          overflow="visible"
        >
          <path
            d="M 5.699 3.226 L 2.985 8.834 L 0 8.834 L 3.623 1.3 C 4.469 -0.458 6.867 -0.426 7.67 1.355 L 11.043 8.834 L 8.414 8.834 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </Link>
  );
}

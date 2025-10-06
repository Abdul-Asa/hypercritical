import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getShortId(id: string): string {
  return id.split("-")[0];
}

export function cleanCodeBlock(code: string): string {
  return code
    .replace(/^```[\w]*\n?/gm, "")
    .replace(/\n?```$/gm, "")
    .trim();
}

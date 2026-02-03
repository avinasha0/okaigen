import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBotPublicKey(): string {
  return `atlas_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * Generate a unique ID similar to CUID format used by Prisma
 * Format: c[timestamp][random][counter]
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  // Generate random string using Math.random() which supports base36
  const random1 = Math.random().toString(36).slice(2);
  const random2 = Math.random().toString(36).slice(2);
  const random = (random1 + random2).slice(0, 12).padEnd(12, "0");
  const counter = Math.floor(Math.random() * 1000).toString(36).padStart(3, "0");
  return `c${timestamp}${random}${counter}`;
}

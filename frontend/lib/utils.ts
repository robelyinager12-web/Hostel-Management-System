import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names safely, resolving conflicts (e.g. "px-2 px-4" -> "px-4").
 * Used across shadcn-style components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
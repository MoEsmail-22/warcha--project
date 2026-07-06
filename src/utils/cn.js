/**
 * cn — class name merge utility.
 * 1. clsx() handles conditional logic (strings, arrays, objects, falsy).
 * 2. twMerge() resolves Tailwind conflicts (later class wins).
 *
 * Example:
 *   cn('btn', isActive && 'btn-primary', disabled && 'opacity-50', className)
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("zh-CN", options).format(value);
}

export function formatUSD(value: number, fractionDigits = 1) {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(fractionDigits)}B`;
  }
  return `$${value.toFixed(fractionDigits)}M`;
}

export function formatPct(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

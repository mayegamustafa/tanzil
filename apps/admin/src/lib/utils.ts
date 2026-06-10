import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric",
    ...options,
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-800",
  approved:   "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  paid:       "bg-emerald-100 text-emerald-800",
  cancelled:  "bg-red-100 text-red-800",
  completed:  "bg-teal-100 text-teal-800",
};

export const PACKAGE_TYPE_LABELS: Record<string, string> = {
  hajj: "Hajj", umrah: "Umrah", local: "Local Tour", international: "International",
};

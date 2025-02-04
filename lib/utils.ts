import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: Date | null) => {
  const date = new Date(dateString!);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

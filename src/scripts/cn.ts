import { twMerge } from "tailwind-merge";

export default function cn(...classes: string[]) {
  return twMerge(classes);
}
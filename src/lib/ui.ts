import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @description Merge class names using clsx and tailwind-merge.
 *
 * @param inputs - The class names to merge.
 * @returns The merged class names.
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

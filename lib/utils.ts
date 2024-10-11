import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const COLORS = [
    "#DC2626",
    "#D97706",
    "#049669",
    "#7C3AED",
    "#DB2777",
    "#14B8A6",
    "#6366F1",
    "#F59E0B",
    "#F97316",
    "#EC4899",
    "#8B5CF6",
    "#4ADE80",
    "#22D3EE",
    "#8B5CF6",
];

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionID: number) {
    return COLORS[connectionID % COLORS.length];
}

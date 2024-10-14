import { Color, camera } from "@/types/canvas";
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

export function pointerEventToCanvasPoint(
    e: React.PointerEvent,
    camera: camera
) {
    return {
        x: Math.round(e.clientX) - camera.x,
        y: Math.round(e.clientY) - camera.y,
    };
}

/**
 * Converts a Color object to a CSS color string(hex code)
 * @param {Color} color the color to convert
 * @returns {string} a CSS color string
 */
export function colorToCss(color: Color) {
    return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

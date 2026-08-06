import type { jsPDF } from "jspdf";

const LOGO_VIEWBOX_WIDTH = 190;
const LOGO_VIEWBOX_HEIGHT = 39;
const WATERMARK_OPACITY = 0.04;
const WATERMARK_COLOR = "#0B1F3A";

let cachedWatermarkDataUrl: Promise<string> | null = null;

async function loadNavyLogoImage(): Promise<HTMLImageElement> {
    const res = await fetch("/admin-logo.svg");
    const raw = await res.text();
    const navySvg = raw.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${WATERMARK_COLOR}"`);
    const blob = new Blob([navySvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    try {
        return await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load admin-logo.svg"));
            img.src = url;
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

/**
 * Rasterizes the navy admin logo pre-rotated 45deg with the watermark opacity
 * baked into the pixel alpha, so PDF placement is a plain centered addImage.
 */
export function getWatermarkDataUrl(): Promise<string> {
    if (!cachedWatermarkDataUrl) {
        cachedWatermarkDataUrl = loadNavyLogoImage().then((img) => {
            const logoWidth = 900;
            const logoHeight = logoWidth * (LOGO_VIEWBOX_HEIGHT / LOGO_VIEWBOX_WIDTH);
            const canvasSize = Math.ceil((logoWidth + logoHeight) * Math.SQRT1_2);

            const canvas = document.createElement("canvas");
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas 2D context unavailable");

            ctx.globalAlpha = WATERMARK_OPACITY;
            ctx.translate(canvasSize / 2, canvasSize / 2);
            ctx.rotate((45 * Math.PI) / 180);
            ctx.drawImage(img, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);

            return canvas.toDataURL("image/png");
        });
    }
    return cachedWatermarkDataUrl;
}

/** Stamps the pre-rotated watermark centered on the current page of `doc`. */
export function stampWatermark(doc: jsPDF, watermarkDataUrl: string): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const size = Math.min(pageWidth, pageHeight) * 0.72;
    const x = (pageWidth - size) / 2;
    const y = (pageHeight - size) / 2;
    doc.addImage(watermarkDataUrl, "PNG", x, y, size, size, "adminWatermark", "FAST");
}

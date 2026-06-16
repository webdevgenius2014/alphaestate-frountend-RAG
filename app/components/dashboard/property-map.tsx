"use client";

import { useEffect, useRef, useState } from "react";

const DISTRICT_COORDS: Record<string, [number, number]> = {
    "Yas Island":      [24.4930, 54.6070],
    "Saadiyat Island": [24.5420, 54.4330],
    "Al Reem Island":  [24.5020, 54.4000],
};

const DEFAULT_COORDS: [number, number] = [24.4539, 54.3773];

interface PropertyMapProps {
    district: string;
    label: string;
}

function FullscreenIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6V2H6M10 2H14V6M14 10V14H10M6 14H2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ExitFullscreenIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2V6H2M14 6H10V2M10 14V10H14M2 10H6V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function PropertyMap({ district, label }: PropertyMapProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const coords = DISTRICT_COORDS[district] ?? DEFAULT_COORDS;

        import("leaflet").then((L) => {
            if (!containerRef.current || mapRef.current) return;

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(containerRef.current!, {
                center: coords,
                zoom: 14,
                zoomControl: true,
                scrollWheelZoom: false,
                attributionControl: false,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
            }).addTo(map);

            L.marker(coords)
                .addTo(map)
                .bindTooltip(label, {
                    permanent: true,
                    direction: "top",
                    offset: [0, -10],
                    className: "leaflet-property-tooltip",
                })
                .openTooltip();

            mapRef.current = map;
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [district, label]);

    // Invalidate map size when fullscreen changes so tiles re-render
    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => mapRef.current?.invalidateSize(), 200);
        }
    }, [isFullscreen]);

    // Sync state when user presses Esc to exit native fullscreen
    useEffect(() => {
        const onFsChange = () => {
            if (!document.fullscreenElement) setIsFullscreen(false);
        };
        document.addEventListener("fullscreenchange", onFsChange);
        return () => document.removeEventListener("fullscreenchange", onFsChange);
    }, []);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            wrapperRef.current?.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    return (
        <>
            <style>{`
                .leaflet-property-tooltip {
                    background: #1a1a2e;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    padding: 5px 10px;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.35);
                }
                .leaflet-property-tooltip::before {
                    border-top-color: #1a1a2e;
                }
            `}</style>
            <div ref={wrapperRef} style={{ width: "100%", height: "100%", position: "relative" }}>
                <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
                <button
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1000,
                        background: "#fff",
                        border: "2px solid rgba(0,0,0,0.2)",
                        borderRadius: 4,
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#333",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                >
                    {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </button>
            </div>
        </>
    );
}

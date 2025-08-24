'use client';

import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  className?: string;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  deals?: any[]; // Add deals prop for compatibility
};

export default function MapView({
  className = "h-96 w-full rounded-xl border border-green-500/20",
  center = [13.388, 52.517], // Berlin (change if you like)
  zoom = 9.5,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double-initialization during hot reloads and re-renders
    if (!containerRef.current || mapRef.current || initializedRef.current) return;

    // Mark as initialized to prevent re-initialization
    initializedRef.current = true;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center,
      zoom,
    });
    mapRef.current = map;

    // Controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.FullscreenControl());

    // Demo marker + popup at the center
    const marker = new maplibregl.Marker()
      .setLngLat(center)
      .setPopup(
        new maplibregl.Popup().setHTML(
          "<strong>Sample Property</strong><br/>You can put details here."
        )
      )
      .addTo(map);

    // Resize when container or window size changes (helps with tabs)
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);
    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    // Cleanup only on unmount, not on re-renders
    return () => {
      if (initializedRef.current) {
        marker.remove();
        ro.disconnect();
        window.removeEventListener("resize", onResize);
        map.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return <div ref={containerRef} className={className} />;
}

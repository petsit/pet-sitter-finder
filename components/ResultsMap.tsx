"use client";

import { useEffect, useRef } from "react";
import { Provider, LatLng } from "@/lib/types";
import { ensureMapsLoaded } from "@/lib/mapsLoader";

interface Props {
  origin: LatLng;
  providers: Provider[];
  activeId?: string;
  onMarkerClick?: (placeId: string) => void;
}

export default function ResultsMap({
  origin,
  providers,
  activeId,
  onMarkerClick,
}: Props) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const readyRef = useRef(false);

  // Initialise the map once
  useEffect(() => {
    let cancelled = false;
    ensureMapsLoaded()
      .then(() => {
        if (cancelled || !mapDiv.current) return;
        mapRef.current = new google.maps.Map(mapDiv.current, {
          center: origin,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          styles: [
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
          ],
        });
        originMarkerRef.current = new google.maps.Marker({
          map: mapRef.current,
          position: origin,
          title: "You are here",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#0d9488",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          zIndex: 1000,
        });
        readyRef.current = true;
        drawProviderMarkers();
      })
      .catch((e) => console.error("[ResultsMap] loader failed", e));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when origin changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(origin);
      if (originMarkerRef.current) originMarkerRef.current.setPosition(origin);
    }
  }, [origin.lat, origin.lng]);

  function drawProviderMarkers() {
    if (!mapRef.current || !readyRef.current) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);

    providers.forEach((p, i) => {
      const marker = new google.maps.Marker({
        map: mapRef.current!,
        position: p.location,
        title: p.name,
        label: {
          text: String(i + 1),
          color: "#ffffff",
          fontWeight: "700",
          fontSize: "12px",
        },
        icon: {
          path: "M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22c0-6.6-5.4-12-12-12z",
          fillColor: p.id === activeId ? "#f59e0b" : "#0d9488",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 1.2,
          labelOrigin: new google.maps.Point(12, 12),
          anchor: new google.maps.Point(12, 34),
        },
      });
      marker.addListener("click", () => onMarkerClick?.(p.id));
      markersRef.current.push(marker);
      bounds.extend(p.location);
    });

    if (providers.length > 0) {
      mapRef.current.fitBounds(bounds, 64);
    }
  }

  // Redraw markers when list or active marker changes
  useEffect(() => {
    drawProviderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers, activeId]);

  return (
    <div
      ref={mapDiv}
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
      aria-label="Map of search results"
    />
  );
}

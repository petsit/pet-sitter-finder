"use client";

import { useEffect, useRef } from "react";
import { LatLng } from "@/lib/types";
import { ensureMapsLoaded } from "@/lib/mapsLoader";

export default function ProviderMap({
  location,
  name,
}: {
  location: LatLng;
  name: string;
}) {
  const mapDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    ensureMapsLoaded()
      .then(() => {
        if (cancelled || !mapDiv.current) return;
        const map = new google.maps.Map(mapDiv.current, {
          center: location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
        });
        new google.maps.Marker({
          position: location,
          map,
          title: name,
          icon: {
            path: "M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22c0-6.6-5.4-12-12-12z",
            fillColor: "#0d9488",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 1.2,
            anchor: new google.maps.Point(12, 34),
          },
        });
      })
      .catch((e) => console.error("[ProviderMap] loader failed", e));
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lng, name]);

  return (
    <div
      ref={mapDiv}
      className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"
    />
  );
}

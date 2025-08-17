"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  isSelected: boolean;
}

interface CustomMapProps {
  id: string;
  center: [number, number];
  zoom: number;
  className?: string;
  markers?: Marker[];
}

const CustomMap: React.FC<CustomMapProps> = ({
  id,
  center,
  zoom,
  className,
  markers = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: maplibregl.Marker }>({});

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: center,
      zoom: zoom,
    });
  }, [center, zoom]);

  // Gérer les marqueurs
  useEffect(() => {
    if (!map.current) return;

    // Supprimer les marqueurs qui ne sont plus dans la liste
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      if (!markers.find((m) => m.id === Number(id))) {
        marker.remove();
        delete markersRef.current[Number(id)];
      }
    });

    // Ajouter ou mettre à jour les marqueurs
    markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.background = marker.isSelected ? "#000" : "#666";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.3s ease";

      if (markersRef.current[marker.id]) {
        // Mettre à jour le marqueur existant
        markersRef.current[marker.id]
          .setLngLat([marker.longitude, marker.latitude])
          .getElement().style.background = marker.isSelected ? "#000" : "#666";
      } else {
        // Créer un nouveau marqueur
        markersRef.current[marker.id] = new maplibregl.Marker({ element: el })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map.current!);
      }
    });
  }, [markers]);

  return <div ref={mapContainer} className={className} id={id} />;
};

export default CustomMap;

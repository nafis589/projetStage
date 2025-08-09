"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MarkerData {
  id: string;
  coordinates: [number, number];
  title: string;
  description?: string;
  color?: string;
}

interface CustomMapEnhancedProps {
  id: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  markers?: MarkerData[];
  onMapClick?: (coordinates: [number, number]) => void;
  showUserLocation?: boolean;
}

const CustomMapEnhanced: React.FC<CustomMapEnhancedProps> = ({
  id,
  center = [1.2228, 6.1319], // Lomé, Togo [longitude, latitude]
  zoom = 13,
  className = "w-full h-full",
  markers = [],
  onMapClick,
  showUserLocation = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side (Next.js SSR compatibility)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
                    if (map.current) {
            map.current.flyTo({ center: coords, zoom: 15 });
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  }, []);

  // Add markers to map
  const addMarkers = useCallback(
    (markersData: MarkerData[]) => {
      if (!map.current) return;

      clearMarkers();

      markersData.forEach((markerData) => {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
          <h3 class="font-semibold text-sm">${markerData.title}</h3>
          ${
            markerData.description
              ? `<p class="text-xs text-gray-600">${markerData.description}</p>`
              : ""
          }
        </div>`
        );

        const marker = new maplibregl.Marker({
          color: markerData.color || "#22c55e",
          scale: 0.8,
        })
          .setLngLat(markerData.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    },
    [clearMarkers]
  );

  useEffect(() => {
    if (!isClient || !mapContainer.current || map.current) return;

    // Initialize the map with OpenStreetMap style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: center as [number, number],
      zoom: zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add geolocate control if user location is enabled
    if (showUserLocation) {
      map.current.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserLocation: true,
        }),
        "top-right"
      );
    }

    // Add click handler
    if (onMapClick) {
      map.current.on("click", (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    // Add default marker if no custom markers provided
    if (markers.length === 0) {
      const defaultMarkers: MarkerData[] = [
        {
          id: "default",
          coordinates: center as [number, number],
          title: "Localisation par défaut",
          description: "Lomé, Togo",
          color: "#22c55e",
        },
      ];
      addMarkers(defaultMarkers);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        clearMarkers();
        map.current.remove();
        map.current = null;
      }
    };
  }, [
    isClient,
    center,
    zoom,
    onMapClick,
    showUserLocation,
    addMarkers,
    clearMarkers,
    markers.length,
  ]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map.current) return;
    addMarkers(markers);
  }, [markers, addMarkers]);

  // Don't render anything on server side
  if (!isClient) {
    return (
      <div
        id={id}
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <div className="text-gray-500 text-sm">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        id={id}
        ref={mapContainer}
        className={className}
        style={{ minHeight: "400px" }}
      />

      {/* Custom controls */}
      {showUserLocation && (
        <button
          onClick={getUserLocation}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="Ma position"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CustomMapEnhanced;

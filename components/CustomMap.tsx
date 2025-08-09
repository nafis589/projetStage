"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Marker {
  id: number | string; // Allow string for user marker ID
  latitude: number;
  longitude: number;
  isSelected?: boolean;
  isUser?: boolean; // To identify the user's marker
}

interface CustomMapProps {
  id: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  markers?: Marker[];
}

const CustomMap: React.FC<CustomMapProps> = ({ 
  id, 
  center = [1.2228, 6.1319], // Lomé, Togo [longitude, latitude]
  zoom = 13,
  className = "w-full h-full",
  markers = []
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const createdMarkers = useRef<maplibregl.Marker[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: center as [number, number], // Use center directly
      zoom: zoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isClient, center, zoom]);

  // Update map center when prop changes
  useEffect(() => {
    if (map.current && center) {
      map.current.flyTo({
        center: center, // Use center directly
        zoom: 14, // You might want to adjust the zoom level when flying to a new location
        essential: true // This animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [center]); // This effect now specifically handles center changes

  // Update markers
  useEffect(() => {
    if (!map.current || !isClient) return;

    // Clear previous markers
    createdMarkers.current.forEach(marker => marker.remove());
    createdMarkers.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const { latitude, longitude, isSelected, isUser } = markerData;

      // Custom marker element
      const el = document.createElement('div');
      
      if (isUser) {
        // Style for the user's location marker
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.backgroundImage = 'url(/user-location.svg)'; // An SVG for a pulsing dot
        el.style.backgroundSize = 'contain';
      } else {
        // Style for professional markers
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        el.style.backgroundColor = isSelected ? '#3b82f6' : '#ef4444'; // blue-500 or red-500
        
        if (isSelected) {
          el.style.outline = '2px solid #3b82f6';
        }
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
      
      createdMarkers.current.push(marker);
    });

  }, [markers, isClient]);


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
    <div 
      id={id}
      ref={mapContainer} 
      className={className}
      style={{ minHeight: '400px' }}
    />
  );
};

export default CustomMap;
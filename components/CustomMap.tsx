"use client";

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface CustomMapProps {
  id: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const CustomMap: React.FC<CustomMapProps> = ({ 
  id, 
  center = [1.2228, 6.1319], // Lomé, Togo [longitude, latitude]
  zoom = 13,
  className = "w-full h-full"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side (Next.js SSR compatibility)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current || map.current) return;

    // Initialize the map with OpenStreetMap style
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
      center: center as [number, number],
      zoom: zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add a default marker with popup
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      '<div class="p-2"><h3 class="font-semibold text-sm">Localisation par défaut</h3><p class="text-xs text-gray-600">Lomé, Togo</p></div>'
    );

    const marker = new maplibregl.Marker({
      color: '#22c55e', // Green color
      scale: 0.8
    })
      .setLngLat(center)
      .setPopup(popup)
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isClient, center, zoom]);

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
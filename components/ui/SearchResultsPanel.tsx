"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Star,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import type { Map, Marker, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Types
interface Professional {
  id: number;
  firstname: string;
  lastname: string;
  profession: string;
  latitude: number;
  longitude: number;
  min_price: number;
  avg_rating: number; // Assuming you have this
  reviews_count: number; // Assuming you have this
}

interface ProfessionalCardProps {
  professional: Professional;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

// Sub-components
const SearchInput = ({
  value,
  onChange,
  placeholder,
  onSearch,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onSearch: () => void;
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-4 pr-10 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-black"
    />
    <button
      onClick={onSearch}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
    >
      <Search size={20} />
    </button>
  </div>
);

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  isSelected,
  onSelect,
  onViewDetails,
}) => (
  <div
    onClick={onSelect}
    className={`p-4 mb-3 rounded-lg cursor-pointer transition-all duration-300 ${
      isSelected
        ? "bg-black text-white shadow-2xl scale-105"
        : "bg-white hover:bg-gray-50 shadow-md"
    }`}
  >
    <div className="flex items-start">
      <div className="flex-1">
        <h3
          className={`font-bold text-lg ${
            isSelected ? "text-white" : "text-black"
          }`}
        >
          {professional.firstname} {professional.lastname}
        </h3>
        <p
          className={`text-sm ${
            isSelected ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {professional.profession}
        </p>
        <div
          className={`flex items-center text-sm mt-1 ${
            isSelected ? "text-yellow-400" : "text-yellow-500"
          }`}
        >
          <Star size={16} className="mr-1" fill="currentColor" />
          <span className="font-bold">{professional.avg_rating.toFixed(1)}</span>
          <span
            className={`ml-1 ${
              isSelected ? "text-gray-400" : "text-gray-500"
            }`}
          >
            ({professional.reviews_count} avis)
          </span>
        </div>
        <p
          className={`text-sm mt-2 font-medium ${
            isSelected ? "text-blue-300" : "text-blue-600"
          }`}
        >
          Disponible dans ~15 min
        </p>
      </div>
      <div className="text-right">
        <p
          className={`font-bold text-xl ${
            isSelected ? "text-white" : "text-black"
          }`}
        >
          {professional.min_price}€
        </p>
        <p
          className={`text-xs ${
            isSelected ? "text-gray-400" : "text-gray-600"
          }`}
        >
          À partir de
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent onSelect from firing
            onViewDetails();
          }}
          className={`mt-2 p-1 rounded-full transition-colors ${
            isSelected
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

// Main Component
const SearchServiceView = () => {
  const [isClient, setIsClient] = useState(false);
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("Lomé, Togo");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: number]: Marker }>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initMap = useCallback(() => {
    if (mapRef.current || !mapContainer.current) return;

    const initialize = async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
        center: [1.2228, 6.1319], // Lomé
        zoom: 12,
      });
      mapRef.current.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right"
      );
    };
    initialize();
  }, []);

  useEffect(() => {
    if (isClient) {
      initMap();
    }
  }, [isClient, initMap]);

  const handleSearch = async () => {
    if (!searchService) return;
    setIsLoading(true);
    setShowResults(true);
    setProfessionals([]);
    setSelectedProfessional(null);

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    try {
      const response = await fetch(
        `/api/professionals/search?service=${encodeURIComponent(
          searchService
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch professionals");
      const data: Professional[] = await response.json();
      setProfessionals(data);

      if (data.length > 0) {
        // Add new markers and fit map to bounds
        const map = mapRef.current;
        if (!map) return;

        const bounds = new (await import("maplibre-gl")).default.LngLatBounds();
        data.forEach((prof) => {
          const pos: LngLatLike = [prof.longitude, prof.latitude];
          const el = document.createElement("div");
          el.className = "w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md";

          const marker = new (await import("maplibre-gl")).default.Marker(el)
            .setLngLat(pos)
            .addTo(map);

          markersRef.current[prof.id] = marker;
          bounds.extend(pos);
        });

        map.fitBounds(bounds, { padding: 150, maxZoom: 15, duration: 1000 });
      }
    } catch (error) {
      console.error("Search error:", error);
      // Add toast notification for error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    const map = mapRef.current;
    if (!map) return;

    // Center map on selected professional
    map.flyTo({
      center: [professional.longitude, professional.latitude],
      zoom: 14,
      duration: 1200,
    });

    // Update marker styles
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (parseInt(id) === professional.id) {
        el.className = "w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-xl z-10 transform scale-125";
      } else {
        el.className = "w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md";
      }
    });
  };
  
  const handleViewDetails = (professional: Professional) => {
    console.log("Viewing details for:", professional.firstname);
    // Here you would open a modal
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden">
      {/* Search Form */}
      <div
        className={`absolute top-0 left-0 right-0 lg:right-auto lg:w-[450px] bg-white p-6 z-20 shadow-lg transition-transform duration-500 ease-in-out ${
          showResults ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Choisissez une course</h1>
        <div className="space-y-4">
          <SearchInput
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
            placeholder="Quel service cherchez-vous ? (ex: Plombier)"
            onSearch={handleSearch}
          />
          <SearchInput
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Où ?"
            onSearch={handleSearch}
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full mt-4 py-3 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
        >
          Rechercher
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapContainer}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      {/* Results Panel */}
      <div
        className={`absolute top-0 left-0 w-full lg:w-[450px] h-full bg-white shadow-2xl z-10 transform transition-transform duration-500 ease-in-out flex flex-col ${
          showResults ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button onClick={() => setShowResults(false)} className="mr-4 p-2">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold">Les professionnels pour vous</h2>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-500" size={40} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {professionals.length > 0 ? (
              professionals.map((prof) => (
                <ProfessionalCard
                  key={prof.id}
                  professional={prof}
                  isSelected={selectedProfessional?.id === prof.id}
                  onSelect={() => handleSelectProfessional(prof)}
                  onViewDetails={() => handleViewDetails(prof)}
                />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p>Aucun professionnel trouvé.</p>
                <p className="text-sm">
                  Essayez une autre recherche.
                </p>
              </div>
            )}
          </div>
        )}
         <div className="p-4 border-t border-gray-200">
            <button className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800">
                Commander
            </button>
        </div>
      </div>
    </div>
  );
};

export default SearchServiceView; 
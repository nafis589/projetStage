"use client";

import React, { useState } from "react";
import { Star, Clock } from "lucide-react";
import ProfessionalDetailsModal from "./ProfessionalDetailsModal";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: number;
  firstname: string;
  lastname: string;
  service_name: string; // <- nouveau champ pour le service trouvé
  description: string;
  address: string;
  min_price: number;
  avg_rating: number;
  reviews_count: number;
  availability: {
    status: string;
    estimated_time: number;
  };
  latitude?: number;
  longitude?: number;
}

interface SearchResultsProps {
  professionals: Professional[];
  onProfessionalSelect: (professional: Professional | null) => void;
  selectedProfessional: Professional | null;
  userLocation: { lat: number; lng: number } | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  professionals,
  onProfessionalSelect,
  selectedProfessional,
  userLocation,
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProfessionalForModal, setSelectedProfessionalForModal] = useState<Professional | null>(null);
  const [bookingLoadingId, setBookingLoadingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleViewDetails = (professional: Professional) => {
    setSelectedProfessionalForModal(professional);
    setShowDetailsModal(true);
  };

  if (professionals.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun professionnel trouvé pour votre recherche
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
      <div className="space-y-3">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className={`
              bg-white rounded-xl p-4 cursor-pointer transition-all duration-300
              ${selectedProfessional?.id === professional.id 
                ? "ring-2 ring-black shadow-lg transform scale-[1.02]" 
                : "shadow-md hover:shadow-lg"}
            `}
            onClick={() => onProfessionalSelect(professional)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">
                    {professional.firstname} {professional.lastname}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {professional.avg_rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      ({professional.reviews_count})
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mt-1">
                  {professional.service_name}
                </p>
                
                <div className="flex items-center mt-2 text-sm text-blue-600">
                  <Clock size={14} className="mr-1" />
                  <span>
                    {professional.availability.status === "available" 
                      ? `Disponible dans ~${professional.availability.estimated_time} min`
                      : "Non disponible"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-xl">
                  {professional.min_price}FCFA
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  À partir de
                </div>
                <div className="space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(professional);
                    }}
                    className="w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Voir détails
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!userLocation) {
                        toast({
                          variant: "destructive",
                          title: "Erreur",
                          description: "Impossible de déterminer votre position pour la réservation.",
                        });
                        return;
                      }
                      setBookingLoadingId(professional.id);
                      try {
                        const response = await fetch('/api/bookings', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            professional_id: professional.id,
                            service: professional.service_name, // <- utiliser le nom du service
                            price: professional.min_price,
                            location: JSON.stringify(userLocation),
                          }),
                        });
                        if (response.ok) {
                          toast({
                            variant: "success",
                            title: "Succès !",
                            description: "Réservation effectuée avec succès!.",
                          });
                        } else {
                          const errorData = await response.json();
                          toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: `Erreur lors de la réservation: ${errorData.error}`,
                          });
                        }
                      } catch {
                        toast({
                          variant: "destructive",
                          title: "Erreur",
                          description: "Une erreur est survenue lors de la réservation.",
                        });
                      } finally {
                        setBookingLoadingId(null);
                      }
                    }}
                    disabled={bookingLoadingId === professional.id}
                    className={`w-full px-3 py-1.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors ${bookingLoadingId === professional.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {bookingLoadingId === professional.id ? "Réservation..." : "Réserver"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetailsModal && selectedProfessionalForModal && (
        <ProfessionalDetailsModal
          professional={selectedProfessionalForModal}
          onClose={() => setShowDetailsModal(false)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
};

export default SearchResults; 
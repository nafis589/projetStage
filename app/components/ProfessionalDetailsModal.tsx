"use client";

import React, { useState } from "react";
import { X, Star, MapPin, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: number;
  firstname: string;
  lastname: string;
  service_name: string;
  description: string;
  address: string;
  min_price: number;
  avg_rating: number;
  reviews_count: number;
  availability: {
    status: string;
    estimated_time: number;
  };
}

interface ProfessionalDetailsModalProps {
  professional: Professional;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
  onBookingSuccess?: () => void;
}

const ProfessionalDetailsModal: React.FC<ProfessionalDetailsModalProps> = ({
  professional,
  onClose,
  userLocation,
  onBookingSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!userLocation) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Impossible de déterminer votre position pour la réservation.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professional_id: professional.id,
          service: professional.service_name,
          price: professional.min_price,
          location: JSON.stringify(userLocation),
        }),
      });
      if (response.ok) {
        toast({
          variant: "success",
          title: "Succès !",
          description: "Réservation effectuée avec succès !",
        });
        onBookingSuccess?.();
        onClose();
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
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-md aspect-square flex flex-col shadow-2xl">
        {/* Header avec profil */}
        <div className="flex flex-col items-center p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>

          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <User size={32} className="text-gray-400" />
          </div>

          {/* Info principale */}
          <h2 className="text-xl font-bold text-center">
            {professional.firstname} {professional.lastname}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {professional.service_name}
          </p>

          {/* Status badge */}
          <div className="mt-2">
            {professional.availability.status === "available" ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Métriques */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">100%</div>
              <div className="text-xs text-gray-500">Utilization Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {professional.avg_rating.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Notes moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {professional.min_price} F
              </div>
              <div className="text-xs text-gray-500">Prix Minimum</div>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-gray-500">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Prochaine disponibilité</span>
              </div>
              <span className="text-sm font-medium">
                {professional.availability.status === "available"
                  ? `${professional.availability.estimated_time} min`
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-gray-500">
                <Star size={16} className="mr-2" />
                <span className="text-sm">Avis</span>
              </div>
              <span className="text-sm font-medium">
                {professional.reviews_count} avis
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-gray-500">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">Localisation</span>
              </div>
              <span className="text-sm font-medium text-right flex-1 ml-2 truncate">
                {professional.address}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Compétences</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                {professional.service_name}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                Professional
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                Expert
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={handleBooking}
              className="w-full px-3 py-1.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
            >
              {loading ? "Réservation..." : "Réserver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsModal;

"use client";

import React from "react";
import { X, Star, MapPin, Clock } from "lucide-react";

interface Professional {
  id: number;
  firstname: string;
  lastname: string;
  profession: string;
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
}

const ProfessionalDetailsModal: React.FC<ProfessionalDetailsModalProps> = ({
  professional,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">
              {professional.firstname} {professional.lastname}
            </h2>
            <p className="text-gray-600 mt-1">{professional.profession}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <Star size={20} className="text-yellow-500 fill-current" />
              <span className="font-bold text-lg">
                {professional.avg_rating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({professional.reviews_count} avis)
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Adresse</div>
                  <div className="font-medium">{professional.address}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Clock className="text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Disponibilité</div>
                  <div className="font-medium text-blue-600">
                    {professional.availability.status === "available"
                      ? `Dans ~${professional.availability.estimated_time} min`
                      : "Non disponible"}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">À propos</h3>
              <p className="text-gray-600">{professional.description}</p>
            </div>

            {/* Services et Tarifs */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Services et Tarifs</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span>Tarif de base</span>
                  <span className="font-bold">{professional.min_price}€/h</span>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Horaires</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>9:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="text-gray-500">Fermé</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                // Handle booking logic
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsModal; 
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/app/dashboard/professional/[id]/page";

// Types

interface ServiceFormData {
  name: string;
  price: string;
  description: string;
}

const ServicePopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
  initialData?: ServiceFormData;
  title: string;
}> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || { name: "", price: "", description: "" }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (
      formData.name.trim() &&
      formData.price.trim() &&
      formData.description.trim()
    ) {
      onSave(formData);
      setFormData({ name: "", price: "", description: "" });
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background transparent */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popover content */}
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nom du service"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ex: 25€/h"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Description du service"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="secondary">
              Annuler
            </Button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePopover;

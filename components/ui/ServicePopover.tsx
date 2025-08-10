import React from "react";
import { X } from "lucide-react";
import {Button} from "@/components/ui/Buttton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validation
const serviceSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom du service doit contenir au moins 2 caractères")
    .max(50, "Le nom du service ne peut pas dépasser 50 caractères"),
  price: z
    .string()
    .min(1, "Le prix est requis")
    .regex(/^\d+(\.\d{1,2})?€?(\/h)?$/, "Format invalide. Exemple: 25€ ou 25€/h"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const ServicePopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
  initialData?: ServiceFormData;
  title: string;
}> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      name: "",
      price: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    onSave(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group min-h-[90px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nom du service"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group min-h-[90px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix
            </label>
            <input
              type="text"
              {...register("price")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="FCFA/h"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div className="form-group min-h-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Description du service"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="secondary" type="button">
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicePopover;

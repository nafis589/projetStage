"use client";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ServicePopover from "@/components/ui/ServicePopover";
import AddressFromCoordinates from "@/app/components/AddressFromCoordinates";
import {
  Home,
  User,
  Briefcase,
  Calendar,
  BookOpen,
  MapPin,
  Settings,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Clock,
  Bell,
  Globe,
  Shield,
  ChevronDown,
  Navigation,
  Search,
} from "lucide-react";
import type { Map, Marker, MapMouseEvent } from "maplibre-gl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Dashboard from "@/components/dashboardTab/Dashboard";

// Types

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

interface TimeOption {
  value: string;
  label: string;
}

interface Day {
  key: keyof WeeklyAvailability;
  label: string;
}

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  dropdownId: string;
}

interface ServiceFormData {
  name: string;
  price: string;
  description: string;
}

interface Props {
  params: Promise<{ id: string }>;
  // You may have other props too
}
interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface Booking {
  id: number;
  client_id: number;
  professional_id: number;
  service: string;
  location: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'accepted';
  price: number;
  client_firstname: string;
  client_lastname: string;
}

interface Profile {
  firstname: string;
  lastname: string;
  email: string;
  bio: string;
  phone: string;
  address: string;
  city: string;
  services: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  icon?: React.ComponentType<{ size: number }>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // <-- Added type prop
}

interface TableAction<T> {
  icon: React.ComponentType<{ size: number }>;
  onClick: (row: T) => void;
  className?: string;
}

interface TableProps<T> {
  headers: string[];
  data: T[];
  actions?: TableAction<T>[];
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface TopbarProps {
  username: string;
  onMenuClick: () => void;
}

interface AvailabilityProps {
  professionalId: string;
}

// Composants réutilisables
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  className = "",
  ...props
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
    )}
    <input
      type={type}
      {...props}
      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
  </div>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
  disabled,
  type = "button", // <-- Default to 'button'
}) => {
  const baseClasses =
    "px-6 py-3 rounded-2xl shadow-md font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-50 text-gray-800 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type} // <-- Forward type prop
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Table = <T extends Record<string, unknown>>({
  headers,
  data,
  actions,
}: TableProps<T>) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          {headers.map((header, index) => (
            <th
              key={index}
              className="text-left py-3 px-4 font-medium text-gray-700"
            >
              {header}
            </th>
          ))}
          {actions && (
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-gray-50 hover:bg-gray-50"
          >
            {Object.values(row).map((cell, cellIndex) => (
              <td key={cellIndex} className="py-3 px-4 text-gray-600">
                {String(cell)}
              </td>
            ))}
            {actions && (
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => action.onClick(row)}
                      className={`p-2 rounded-xl ${
                        action.className || "hover:bg-gray-100"
                      }`}
                    >
                      <action.icon size={16} />
                    </button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Mon profil", icon: User },
    { id: "services", label: "Mes services", icon: Briefcase },
    { id: "availability", label: "Mes disponibilités", icon: Calendar },
    { id: "bookings", label: "Réservations", icon: BookOpen },
    { id: "location", label: "Localisation", icon: MapPin },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const logoutItem = { id: "logout", label: "Déconnexion", icon: LogOut };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:shadow-none flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-black">Geservice</h1>
          <p className="text-gray-500 text-sm">Dashboard</p>
        </div>

        {/* Navigation principale */}
        <nav className="px-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bouton de déconnexion en bas */}
        <div className="p-4 flex-shrink-0 border-t border-gray-100">
          <button
            onClick={() => {
              setActiveSection(logoutItem.id);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
              activeSection === logoutItem.id
                ? "bg-red-500 text-white"
                : "text-red-600 hover:bg-red-50 bg-red-50/50"
            }`}
          >
            <LogOut size={20} />
            <span className="font-medium">{logoutItem.label}</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Topbar Component
const Topbar: React.FC<TopbarProps> = ({ username, onMenuClick }) => (
  <div className="fixed top-0 right-0 left-0 lg:left-64 bg-white shadow-sm px-6 py-4 flex items-center justify-between z-30">
    <div className="flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
      >
        <Home size={20} />
      </button>
      <h2 className="text-2xl font-bold text-black">Bienvenu, {username}</h2>
    </div>

    {/* Profil circulaire */}
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-shadow">
      <span className="text-white font-bold text-2xl">
        {username ? username.charAt(0).toUpperCase() : "U"}
      </span>
    </div>
  </div>
);

// Section Components
<Dashboard />

const nameRegex = /^[A-Za-zÀ-ÿ' -]+$/;

const profileSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom est trop court")
    .regex(nameRegex, "Le prénom ne doit contenir que des lettres et caractères valides"),
  lastname: z
    .string()
    .min(2, "Le nom est trop court")
    .regex(nameRegex, "Le nom ne doit contenir que des lettres et caractères valides"),
  email: z.string().email("L'adresse e-mail n'est pas valide"),
  bio: z
    .string()
    .max(500, "La biographie ne peut pas dépasser 500 caractères")
    .optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Le numéro de téléphone doit contenir 10 chiffres")
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC<{ professionalId: string }> = ({ professionalId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/professionals/${professionalId}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          // Set form values
          setValue("firstname", data[0].firstname);
          setValue("lastname", data[0].lastname);
          setValue("email", data[0].email);
          setValue("bio", data[0].bio);
          setValue("phone", data[0].phone);
          setValue("address", data[0].address);
          setValue("city", data[0].city);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le profil.",
        });
      }
    };
    fetchProfile();
  }, [professionalId, toast, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch(`/api/professionals/${professionalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          variant: "success",
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La mise à jour du profil a échoué.",
        });
      }
    } catch (error) {
      console.error("Failed to save profile", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite.",
      });
    }
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-screen"><div>Chargement...</div></div>;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-black">
          Informations personnelles
        </h3>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="secondary"
          icon={isEditing ? X : Edit3}
        >
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group min-h-[90px]">
            <Input
              label="Prénom"
              {...register("firstname")}
              placeholder="Votre prénom"
              disabled={!isEditing}
              className={errors.firstname ? "border-red-500" : ""}
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
            )}
          </div>
          <div className="form-group min-h-[90px]">
            <Input
              label="Nom"
              {...register("lastname")}
              placeholder="Votre nom"
              disabled={!isEditing}
              className={errors.lastname ? "border-red-500" : ""}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        <div className="form-group min-h-[90px]">
          <Input
            label="Email"
            type="email"
            {...register("email")}
            placeholder="Votre email"
            disabled={!isEditing}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group min-h-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className={`w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.bio ? "border-red-500" : ""
            }`}
            placeholder="Parlez-nous de vous..."
            disabled={!isEditing}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group min-h-[90px]">
            <Input
              label="Téléphone"
              {...register("phone")}
              placeholder="Votre téléphone"
              disabled={!isEditing}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div className="form-group min-h-[90px]">
            <Input
              label="Adresse"
              {...register("address")}
              placeholder="Votre adresse"
              disabled={!isEditing}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="form-group min-h-[90px]">
          <Input
            label="Ville"
            {...register("city")}
            placeholder="Votre ville"
            disabled={!isEditing}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              variant="secondary"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

//popover service

const Services: React.FC<{ professionalId: string }> = ({ professionalId }) => {
  const [services, setServices] = useState<Service[]>([]);

  const [popoverState, setPopoverState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    editingService?: Service;
  }>({ isOpen: false, mode: "add" });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/service/${professionalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [professionalId]);

  const handleAddService = () => {
    setPopoverState({ isOpen: true, mode: "add" });
  };

  const handleEditService = (service: Service) => {
    setPopoverState({
      isOpen: true,
      mode: "edit",
      editingService: service,
    });
  };

  const handleSaveService = async (data: ServiceFormData) => {
    if (popoverState.mode === "add") {
      try {
        const response = await fetch(`/api/service/${professionalId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, professionalId }),
        });

        console.log(data);

        if (!response.ok) {
          throw new Error("Failed to create service");
        }

        const newService = await response.json();
        setServices([...services, newService]);
      } catch (error) {
        console.error("Error creating service:", error);
      }
    } else if (popoverState.mode === "edit" && popoverState.editingService) {
      // Mettez à jour la logique de modification ici si nécessaire
      setServices(
        services.map((s) =>
          s.id === popoverState.editingService!.id ? { ...s, ...data } : s
        )
      );
    }
    setPopoverState({ isOpen: false, mode: "add" });
  };

  const handleClosePopover = () => {
    setPopoverState({ isOpen: false, mode: "add" });
  };

  const actions: TableAction<Record<string, string | number>>[] = [
    {
      icon: Edit3,
      onClick: (serviceData: Record<string, string | number>) => {
        const service = services.find((s) => s.name === serviceData.name);
        if (service) {
          handleEditService(service);
        }
      },
      className: "hover:bg-blue-50 text-blue-600",
    },
    {
      icon: Trash2,
      onClick: async (serviceData: Record<string, string | number>) => {
        const service = services.find((s) => s.name === serviceData.name);
        if (!service) return;
        try {
          const response = await fetch(`/api/service/${service.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du service");
          }
          setServices(services.filter((s) => s.id !== service.id));
        } catch (error) {
          console.error("Erreur lors de la suppression du service:", error);
        }
      },
      className: "hover:bg-red-50 text-red-600",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-black">Mes services</h3>
        <Button icon={Plus} onClick={handleAddService}>
          Ajouter un service
        </Button>
      </div>

      <Card>
        {services.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500 text-center">
            Veuillez ajouter vos informations de service
          </div>
        ) : (
          <Table
            headers={["Service", "Prix", "Description"]}
            data={services.map((s) => ({
              name: s.name,
              price: `${s.price} FCFA/h`,
              description: s.description,
            }))}
            actions={actions}
          />
        )}
      </Card>

      <ServicePopover
        isOpen={popoverState.isOpen}
        onClose={handleClosePopover}
        onSave={handleSaveService}
        initialData={
          popoverState.editingService
            ? {
                name: popoverState.editingService.name,
                price: popoverState.editingService.price,
                description: popoverState.editingService.description,
              }
            : undefined
        }
        title={
          popoverState.mode === "add"
            ? "Ajouter un service"
            : "Modifier le service"
        }
      />
    </div>
  );
};

const Availability = ({ professionalId }: AvailabilityProps) => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    monday: { enabled: false, timeSlots: [] },
    tuesday: { enabled: false, timeSlots: [] },
    wednesday: { enabled: false, timeSlots: [] },
    thursday: { enabled: false, timeSlots: [] },
    friday: { enabled: false, timeSlots: [] },
    saturday: { enabled: false, timeSlots: [] },
    sunday: { enabled: false, timeSlots: [] },
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les disponibilités existantes
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/availability?professionalId=${professionalId}`
        );
        if (response.ok) {
          const data = await response.json();
          setAvailability(data);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (professionalId) {
      fetchAvailability();
    }
  }, [professionalId]);

  const days: Day[] = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const timeOptions: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = formatTime(time);
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  const toggleDay = (day: keyof WeeklyAvailability): void => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        timeSlots: !prev[day].enabled ? [] : prev[day].timeSlots,
      },
    }));
  };

  const addTimeSlot = (day: keyof WeeklyAvailability): void => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number
  ): void => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number,
    field: keyof TimeSlot,
    value: string
  ): void => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId,
          availability,
        }),
      });
      console.log(availability);

      if (response.ok) {
        const result = await response.json();
        toast({
          variant: "success",
          title: "Succès !",
          description: `Disponibilités sauvegardées avec succès! ${result.count} créneaux enregistrés.`,
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Erreur lors de la sauvegarde: ${error.error}`,
        });
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des disponibilités.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const TimeSelector: React.FC<TimeSelectorProps> = ({
    value,
    onChange,
    placeholder,
    dropdownId,
  }) => {
    const isOpen = openDropdown === dropdownId;

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 flex items-center justify-between min-w-28"
        >
          <span className="text-gray-800 font-medium">
            {value ? formatTime(value) : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-2">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 ${
                    value === option.value
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openDropdown && !target.closest(".relative")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des disponibilités...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Paramètres de disponibilité
          </h1>
          <p className="text-gray-600">
            Définissez votre planning hebdomadaire et vos créneaux de disponibilité
          </p>
        </div>

        <div className="space-y-6">
          {days.map(({ key, label }) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm font-medium ${
                      availability[key].enabled
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {availability[key].enabled ? "Available" : "Unavailable"}
                  </span>
                  <button
                    onClick={() => toggleDay(key)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      availability[key].enabled
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                        availability[key].enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {availability[key].enabled && (
                <div className="space-y-4">
                  {availability[key].timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            Time slot {index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => removeTimeSlot(key, index)}
                          className="ml-auto p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center space-x-4">
                        <TimeSelector
                          value={slot.start}
                          onChange={(value) =>
                            updateTimeSlot(key, index, "start", value)
                          }
                          placeholder="Start time"
                          dropdownId={`${key}-${index}-start`}
                        />

                        <div className="flex-shrink-0">
                          <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
                        </div>

                        <TimeSelector
                          value={slot.end}
                          onChange={(value) =>
                            updateTimeSlot(key, index, "end", value)
                          }
                          placeholder="End time"
                          dropdownId={`${key}-${index}-end`}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addTimeSlot(key)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-4 text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add time slot</span>
                  </button>

                  {availability[key].timeSlots.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No time slots added yet</p>
                      <p className="text-xs mt-1">
                        Click &quot;Add time slot&quot; to set your availability
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => {
                setAvailability({
                  monday: { enabled: false, timeSlots: [] },
                  tuesday: { enabled: false, timeSlots: [] },
                  wednesday: { enabled: false, timeSlots: [] },
                  thursday: { enabled: false, timeSlots: [] },
                  friday: { enabled: false, timeSlots: [] },
                  saturday: { enabled: false, timeSlots: [] },
                  sunday: { enabled: false, timeSlots: [] },
                });
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
            >
              Reset All
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = React.useCallback(async () => {
    try {
      const response = await fetch('/api/bookings?view=professional');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les réservations.",
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des réservations.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateBookingStatus = async (bookingId: number, status: 'accepted' | 'cancelled' | 'completed') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(prevBookings =>
          prevBookings.map(b => (b.id === bookingId ? { ...b, status: updatedBooking.status } : b))
        );
        toast({
          variant: "success",
          title: "Statut mis à jour !",
          description: `La réservation a été ${status === 'accepted' ? 'confirmée' : 'annulée'}.`,
        });
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation.",
      });
    }
  };


  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "confirmed":
        return "text-blue-600 bg-blue-50";
      case "accepted":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const actions: TableAction<Booking>[] = [
    {
      icon: Check,
      onClick: (booking: Booking) => {
        handleUpdateBookingStatus(booking.id, 'accepted');
      },
      className: "hover:bg-green-50 text-green-600",
    },
    {
      icon: X,
      onClick: (booking: Booking) => {
        handleUpdateBookingStatus(booking.id, 'cancelled');
      },
      className: "hover:bg-red-50 text-red-600",
    },
  ];

  const completedAction: TableAction<Booking> = {
    icon: Check,
    onClick: (booking: Booking) => {
      handleUpdateBookingStatus(booking.id, 'completed');
    },
    className: "hover:bg-blue-50 text-blue-600",
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-black">Réservations</h3>
        <Card>
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des réservations...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black">Réservations</h3>
      <Toaster />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Client
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Service
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Localisation
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Montant
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Statut
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                let locationDisplay;
                try {
                  const coords = JSON.parse(booking.location);
                  if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
                    locationDisplay = <AddressFromCoordinates lat={coords.lat} lng={coords.lng} />;
                  } else {
                    locationDisplay = <span>{booking.location}</span>;
                  }
                } catch {
                  locationDisplay = <span>{booking.location}</span>;
                }
                
                return (
                <tr
                  key={booking.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-600">{`${booking.client_firstname} ${booking.client_lastname}`}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.service}</td>
                  <td className="py-3 px-4 text-gray-600">{new Date(booking.booking_time).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-xs">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="truncate">
                        {locationDisplay}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {`${booking.price}F`}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-2xl text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {booking.status === "pending" &&
                        actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(booking)}
                            className={`p-2 rounded-xl ${action.className}`}
                          >
                            <action.icon size={16} />
                          </button>
                        ))}

                        {(booking.status === "confirmed" || booking.status === "accepted") && (
                        <button
                          onClick={() => completedAction.onClick(booking)}
                          className={`p-2 rounded-xl ${completedAction.className}`}
                          title="Marquer comme terminé"
                        >
                          <completedAction.icon size={16} />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};



const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<{
    email: boolean;
    sms: boolean;
    push: boolean;
  }>({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black">Paramètres</h3>

      <Card>
        <h4 className="text-lg font-medium text-black mb-4">Notifications</h4>
        <div className="space-y-4">
          {Object.entries(notifications).map(([type, enabled]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <span className="capitalize">
                  {type === "push" ? "Push" : type === "sms" ? "SMS" : "Email"}
                </span>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [type]: !prev[type as keyof typeof prev],
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  enabled ? "bg-black" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    enabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="text-lg font-medium text-black mb-4">Préférences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-400" />
              <span>Langue</span>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black">
              <option>Français</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-400" />
              <span>Profil public</span>
            </div>
            <button className="w-12 h-6 bg-black rounded-full">
              <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-6" />
            </button>
          </div>
        </div>
      </Card>

      <Button icon={Check}>Sauvegarder les paramètres</Button>
    </div>
  );
};

// Location Tab Component
const LocationTab: React.FC<{ professionalId: string }> = ({
  professionalId,
}) => {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({
    address: "",
    latitude: 6.1319, // Lomé par défaut
    longitude: 1.2228,
  });

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load existing location
  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/location?userId=${professionalId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setLocation({
              address: data.address || "",
              latitude: parseFloat(data.latitude) || 6.1319,
              longitude: parseFloat(data.longitude) || 1.2228,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (professionalId) {
      fetchLocation();
    }
  }, [professionalId]);

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapContainer.current || map.current) return;

    const initializeMap = async () => {
      const maplibregl = (await import("maplibre-gl")).default;

      map.current = new maplibregl.Map({
        container: mapContainer.current!,
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
        center: [location.longitude, location.latitude],
        zoom: 13,
        attributionControl: false,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");

      // Add draggable marker
      marker.current = new maplibregl.Marker({
        color: "#22c55e",
        draggable: true,
      })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);

      // Update location when marker is dragged
      const currentMarker = marker.current;
      const currentMap = map.current;
      if (currentMarker && currentMap) {
        currentMarker.on("dragend", () => {
          const lngLat = currentMarker.getLngLat();
          setLocation((prev) => ({
            ...prev,
            latitude: lngLat.lat,
            longitude: lngLat.lng,
          }));
        });
        currentMap.on("click", (e: MapMouseEvent) => {
          const { lng, lat } = e.lngLat;
          currentMarker.setLngLat([lng, lat]);
          setLocation((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        });
      }

      // Add click event to map
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isClient, location.latitude, location.longitude]);

  // Update marker position when location changes
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([location.longitude, location.latitude]);
      map.current.setCenter([location.longitude, location.latitude]);
    }
  }, [location.latitude, location.longitude]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "La géolocalisation n'est pas supportée par votre navigateur.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        toast({
          variant: "success",
          title: "Position détectée !",
          description: "Votre position actuelle a été utilisée.",
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Erreur de géolocalisation",
          description: `Impossible d'obtenir votre position actuelle. ${error.message}`,
        });
      }
    );
  };

  const handleSaveLocation = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: professionalId,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Localisation sauvegardée !",
          description:
            "Votre position professionnelle a été enregistrée avec succès.",
        });
      } else {
        throw new Error("Failed to save location");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la localisation.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-black">Localisation</h3>
        <Card>
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de la localisation...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="text-green-600" size={28} />
        <h3 className="text-xl font-bold text-black">
          Définir ma position professionnelle
        </h3>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          {/* Search Address */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher une adresse
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tapez une adresse..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Address Input */}
          <Input
            label="Adresse complète"
            value={location.address}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Entrez votre adresse professionnelle"
          />

          {/* Coordinates Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                value={location.latitude.toFixed(6)}
                onChange={(e) =>
                  setLocation((prev) => ({
                    ...prev,
                    latitude: parseFloat(e.target.value) || 0,
                  }))
                }
                step="0.000001"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                value={location.longitude.toFixed(6)}
                onChange={(e) =>
                  setLocation((prev) => ({
                    ...prev,
                    longitude: parseFloat(e.target.value) || 0,
                  }))
                }
                step="0.000001"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Current Location Button */}
          <Button
            variant="primary"
            icon={Navigation}
            onClick={handleUseCurrentLocation}
            className="w-full md:w-auto"
          >
            Utiliser ma position actuelle
          </Button>

          {/* Map Container */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carte interactive
            </label>
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <div
                ref={mapContainer}
                className="w-full h-96"
                style={{ minHeight: "400px" }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Cliquez sur la carte ou déplacez le marqueur pour définir votre
              position
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              icon={Check}
              onClick={handleSaveLocation}
              disabled={isSaving}
            >
              {isSaving ? "Enregistrement..." : "Enregistrer ma localisation"}
            </Button>
          </div>
        </div>
      </Card>
      <Toaster />
    </div>
  );
};

const ProfessionalDashboard = ({ params }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { id: professionalId } = React.use(params);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user && session.user.role !== "professional") {
      router.push("/dashboard/client");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/professionals/${professionalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("it is:", data);
        setUserName(data[0].firstname);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("Utilisateur");
      }
    };

    if (professionalId) {
      fetchUserName();
    }
  }, [professionalId]);

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen"><div>Chargement...</div></div>;
  }

  const renderSection = (): React.ReactNode => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onQuickAction={setActiveSection} />;
      case "profile":
        return <Profile professionalId={professionalId} />;
      case "services":
        return <Services professionalId={professionalId} />;
      case "availability":
        return <Availability professionalId={professionalId} />;
      case "bookings":
        return <Bookings />;
      case "location":
        return <LocationTab professionalId={professionalId} />;
      case "settings":
        return <SettingsPage />;
      case "logout":
        alert("Déconnexion...");
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 lg:ml-0">
        <Topbar username={userName} onMenuClick={() => setIsMobileOpen(true)} />

        <main className="pt-20 p-6 h-screen overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;

"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Home,
  User,
  Briefcase,
  Calendar,
  BookOpen,
  CreditCard,
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
} from "lucide-react";

// Types

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
  client: string;
  service: string;
  date: string;
  status: "Confirmée" | "En attente" | "Annulée";
  amount: string;
}

interface Payment {
  date: string;
  client: string;
  service: string;
  amount: string;
  status: "Reçu" | "En attente";
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

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  icon?: React.ComponentType<{ size: number }>;
}

interface TableAction {
  icon: React.ComponentType<{ size: number }>;
  onClick: (row: Record<string, string | number>) => void;
  className?: string;
}

interface TableProps {
  headers: string[];
  data: Record<string, string | number>[];
  actions?: TableAction[];
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface TopbarProps {
  title: string;
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
  value,
  onChange,
  placeholder,
  className = "",
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
  </div>
);

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
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
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Table: React.FC<TableProps> = ({ headers, data, actions }) => (
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
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "settings", label: "Paramètres", icon: Settings },
    { id: "logout", label: "Déconnexion", icon: LogOut },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:shadow-none`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-black">ServicePro</h1>
          <p className="text-gray-500 text-sm">Dashboard</p>
        </div>

        <nav className="px-4">
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
      </div>
    </>
  );
};

// Topbar Component
const Topbar: React.FC<TopbarProps> = ({ title, onMenuClick }) => (
  <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-start">
    <button
      onClick={onMenuClick}
      className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
    >
      <Home size={20} />
    </button>
    <h2 className="text-2xl font-bold text-black">{title}</h2>
  </div>
);

// Section Components
const Dashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Services actifs</p>
            <p className="text-3xl font-bold text-black">12</p>
          </div>
          <Briefcase className="text-gray-400" size={32} />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Réservations</p>
            <p className="text-3xl font-bold text-black">28</p>
          </div>
          <BookOpen className="text-gray-400" size={32} />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Revenus ce mois</p>
            <p className="text-3xl font-bold text-black">€2,450</p>
          </div>
          <CreditCard className="text-gray-400" size={32} />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Note moyenne</p>
            <p className="text-3xl font-bold text-black">4.8</p>
          </div>
          <User className="text-gray-400" size={32} />
        </div>
      </Card>
    </div>

    <Card>
      <h3 className="text-xl font-bold text-black mb-4">
        Réservations récentes
      </h3>
      <Table
        headers={["Client", "Service", "Date", "Statut"]}
        data={[
          {
            client: "Marie Dubois",
            service: "Ménage",
            date: "15 Jan 2025",
            statut: "Confirmée",
          },
          {
            client: "Pierre Martin",
            service: "Jardinage",
            date: "16 Jan 2025",
            statut: "En attente",
          },
          {
            client: "Sophie Bernard",
            service: "Ménage",
            date: "17 Jan 2025",
            statut: "Confirmée",
          },
        ]}
      />
    </Card>
  </div>
);

const Profile: React.FC<{ professionalId: string }> = ({ professionalId }) => {
  const [profile, setProfile] = useState<Profile>({
    firstname: "Jean",
    lastname: "Dupont",
    email: "jean.dupont@email.com",
    bio: "Professionnel expérimenté dans les services à domicile",
    phone: "06 12 34 56 78",
    address: "123 rue de la Paix",
    city: "Paris",
    services: "Ménage, Jardinage, Bricolage",
  });

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/professionals/${professionalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      console.log("Updating profile:", profile);

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("Profile updated successfully:", data);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-black mb-6">
        Informations personnelles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          value={profile.firstname}
          onChange={(e) => handleChange("firstname", e.target.value)}
        />
        <Input
          label="Nom"
          value={profile.lastname}
          onChange={(e) => handleChange("lastname", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={profile.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          label="Téléphone"
          value={profile.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <Input
          label="Adresse"
          value={profile.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
        <Input
          label="Ville"
          value={profile.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>
      <Input
        label="Bio"
        value={profile.bio}
        onChange={(e) => handleChange("bio", e.target.value)}
      />
      <Input
        label="Services proposés"
        value={profile.services}
        onChange={(e) => handleChange("services", e.target.value)}
      />
      <Button icon={Check} onClick={handleSave}>
        Sauvegarder les modifications
      </Button>
    </Card>
  );
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Ménage",
      price: "25€/h",
      description: "Service de ménage complet",
    },
    {
      id: 2,
      name: "Jardinage",
      price: "30€/h",
      description: "Entretien des espaces verts",
    },
    {
      id: 3,
      name: "Bricolage",
      price: "35€/h",
      description: "Petits travaux de bricolage",
    },
  ]);

  const handleAddService = () => {
    const newService: Service = {
      id: services.length + 1,
      name: "Nouveau service",
      price: "0€/h",
      description: "Description du service",
    };
    setServices([...services, newService]);
  };

  const actions: TableAction[] = [
    {
      icon: Edit3,
      onClick: (service: Record<string, string | number>) => {
        console.log("Edit", service);
      },
      className: "hover:bg-blue-50 text-blue-600",
    },
    {
      icon: Trash2,
      onClick: (service: Record<string, string | number>) => {
        setServices(services.filter((s) => s.id !== service.id));
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
        <Table
          headers={["Service", "Prix", "Description"]}
          data={services.map((s) => ({
            name: s.name,
            price: s.price,
            description: s.description,
          }))}
          actions={actions}
        />
      </Card>
    </div>
  );
};

const Availability = ({ professionalId }: AvailabilityProps) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hours = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const toggleSlot = (day: string, hour: string) => {
    const slot = `${day}-${hour}`;
    const newSlots = new Set(selectedSlots);
    if (newSlots.has(slot)) {
      newSlots.delete(slot);
    } else {
      newSlots.add(slot);
    }
    setSelectedSlots(newSlots);
  };

  const handleSave = async () => {
    try {
      const payload = Array.from(selectedSlots).map((slot) => {
        const [day, hour] = slot.split("-");
        return { day, hour };
      });

      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: professionalId,
          slots: payload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de la sauvegarde");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-black">Mes disponibilités</h3>
        <Button
          icon={Check}
          onClick={handleSave}
          className={loading ? "opacity-50 pointer-events-none" : ""}
        >
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          Vos disponibilités ont été enregistrées avec succès !
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 min-w-max">
            <div></div>
            {days.map((day) => (
              <div
                key={day}
                className="text-center font-medium text-gray-700 p-2"
              >
                {day}
              </div>
            ))}

            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="text-sm text-gray-600 p-2 text-right">
                  {hour}
                </div>
                {days.map((day) => {
                  const slot = `${day}-${hour}`;
                  const isSelected = selectedSlots.has(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => !loading && toggleSlot(day, hour)}
                      className={`p-2 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "bg-black border-black text-white"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <Clock size={16} className="mx-auto" />
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

const Bookings: React.FC = () => {
  const bookings: Booking[] = [
    {
      client: "Marie Dubois",
      service: "Ménage",
      date: "15 Jan 2025",
      status: "Confirmée",
      amount: "50€",
    },
    {
      client: "Pierre Martin",
      service: "Jardinage",
      date: "16 Jan 2025",
      status: "En attente",
      amount: "75€",
    },
    {
      client: "Sophie Bernard",
      service: "Ménage",
      date: "17 Jan 2025",
      status: "Confirmée",
      amount: "50€",
    },
    {
      client: "Lucas Moreau",
      service: "Bricolage",
      date: "18 Jan 2025",
      status: "Annulée",
      amount: "100€",
    },
  ];

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmée":
        return "text-green-600 bg-green-50";
      case "En attente":
        return "text-yellow-600 bg-yellow-50";
      case "Annulée":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const actions: TableAction[] = [
    {
      icon: Check,
      onClick: (row: Record<string, string | number>) => {
        console.log("Accept", row);
      },
      className: "hover:bg-green-50 text-green-600",
    },
    {
      icon: X,
      onClick: (row: Record<string, string | number>) => {
        console.log("Reject", row);
      },
      className: "hover:bg-red-50 text-red-600",
    },
  ];

  const bookingsData = bookings.map((booking) => ({
    client: booking.client,
    service: booking.service,
    date: booking.date,
    amount: booking.amount,
    status: booking.status,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black">Réservations</h3>

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
              {bookingsData.map((booking, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-600">{booking.client}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.service}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.date}</td>
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {booking.amount}
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
                      {booking.status === "En attente" &&
                        actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(booking)}
                            className={`p-2 rounded-xl ${action.className}`}
                          >
                            <action.icon size={16} />
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Payments: React.FC = () => {
  const payments: Payment[] = [
    {
      date: "15 Jan 2025",
      client: "Marie Dubois",
      service: "Ménage",
      amount: "50€",
      status: "Reçu",
    },
    {
      date: "12 Jan 2025",
      client: "Paul Durand",
      service: "Jardinage",
      amount: "75€",
      status: "Reçu",
    },
    {
      date: "10 Jan 2025",
      client: "Anne Petit",
      service: "Bricolage",
      amount: "100€",
      status: "En attente",
    },
    {
      date: "08 Jan 2025",
      client: "Marc Roux",
      service: "Ménage",
      amount: "50€",
      status: "Reçu",
    },
  ];

  const paymentsData = payments.map((payment) => ({
    date: payment.date,
    client: payment.client,
    service: payment.service,
    amount: payment.amount,
    status: payment.status,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black">Historique des paiements</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-500 text-sm">Total ce mois</p>
          <p className="text-3xl font-bold text-black">€2,450</p>
        </Card>
        <Card>
          <p className="text-gray-500 text-sm">En attente</p>
          <p className="text-3xl font-bold text-black">€100</p>
        </Card>
        <Card>
          <p className="text-gray-500 text-sm">Taux de commission</p>
          <p className="text-3xl font-bold text-black">12%</p>
        </Card>
      </div>

      <Card>
        <Table
          headers={["Date", "Client", "Service", "Montant", "Statut"]}
          data={paymentsData}
        />
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

const ProfessionalDashboard = ({ params }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { id: professionalId } = React.use(params);
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "professional") {
      router.push("/dashboard/client");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  const getSectionTitle = (section: string): string => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      profile: "Mon profil",
      services: "Mes services",
      availability: "Mes disponibilités",
      bookings: "Réservations",
      payments: "Paiements",
      settings: "Paramètres",
    };
    return titles[section] || "Dashboard";
  };

  const renderSection = (): React.ReactNode => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile professionalId={professionalId} />;
      case "services":
        return <Services />;
      case "availability":
        return <Availability professionalId={professionalId} />;
      case "bookings":
        return <Bookings />;
      case "payments":
        return <Payments />;
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
        <Topbar
          title={getSectionTitle(activeSection)}
          onMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="p-6">{renderSection()}</main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;

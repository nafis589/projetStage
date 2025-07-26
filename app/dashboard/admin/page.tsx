"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  DollarSign,
  User,
  ChevronDown,
  Search,
  Home,
  Star,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AdminUser from "../../components/AdminUser";

// Types pour l'application de services à domicile
interface ServiceBooking {
  id: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  status: "En attente" | "Confirmé" | "En cours" | "Terminé" | "Annulé";
  price: number;
  address: string;
  rating?: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
  bookings?: number;
  revenue?: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Données pour les graphiques
  const revenueData: ChartDataPoint[] = [
    { name: "Lun", value: 2400, bookings: 12 },
    { name: "Mar", value: 1398, bookings: 8 },
    { name: "Mer", value: 9800, bookings: 24 },
    { name: "Jeu", value: 3908, bookings: 18 },
    { name: "Ven", value: 4800, bookings: 22 },
    { name: "Sam", value: 3800, bookings: 16 },
    { name: "Dim", value: 4300, bookings: 19 },
  ];

  const serviceDistribution = [
    { name: "Ménage", value: 35, color: "#10B981" },
    { name: "Plomberie", value: 25, color: "#F59E0B" },
    { name: "Électricité", value: 20, color: "#EF4444" },
    { name: "Jardinage", value: 15, color: "#9CA3AF" },
    { name: "Autres", value: 5, color: "#D1D5DB" },
  ];

  // Données des réservations récentes
  const recentBookings: ServiceBooking[] = [
    {
      id: "#SRV001",
      clientName: "Marie Dubois",
      serviceName: "Ménage complet",
      professionalName: "Sophie Martin",
      date: "2024-01-15",
      time: "09:00",
      status: "Confirmé",
      price: 85,
      address: "123 Rue de la Paix, Paris",
      rating: 4.8,
    },
    {
      id: "#SRV002",
      clientName: "Jean Dupont",
      serviceName: "Réparation plomberie",
      professionalName: "Pierre Leroy",
      date: "2024-01-15",
      time: "14:30",
      status: "En cours",
      price: 120,
      address: "456 Avenue des Champs, Lyon",
    },
    {
      id: "#SRV003",
      clientName: "Claire Bernard",
      serviceName: "Installation électrique",
      professionalName: "Marc Rousseau",
      date: "2024-01-16",
      time: "10:00",
      status: "En attente",
      price: 200,
      address: "789 Boulevard Saint-Germain, Marseille",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-green-100 text-green-800";
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Terminé":
        return "bg-gray-100 text-gray-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar Fixed */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Home className="text-black" size={48} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Geservice</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 h-full overflow-y-auto pb-20">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "text-white bg-black"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Tableau de bord</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "text-white bg-black"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Utilisateurs</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header Fixed */}
        <header
          className="bg-white border-b border-gray-200 px-6 py-4 fixed w-full z-20"
          style={{ left: "256px", width: "calc(100% - 256px)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Admin
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-48"
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Admin</div>
                  <div className="text-xs text-gray-500">Administrateur</div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable */}
        <main className="pt-20 p-4 h-full overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total Réservations
                      </p>
                      <div className="flex items-center mt-2 text-green-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span className="text-sm font-medium">+12.5%</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Calendar className="text-gray-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Professionnels Actifs
                      </p>
                      <div className="flex items-center mt-2 text-green-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span className="text-sm font-medium">+5.2%</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <UserCheck className="text-gray-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">€24,580</p>
                      <p className="text-sm text-gray-600 mt-1">Revenus ce mois</p>
                      <div className="flex items-center mt-2 text-green-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span className="text-sm font-medium">+18.7%</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="text-gray-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                      <p className="text-sm text-gray-600 mt-1">Note Moyenne</p>
                      <div className="flex items-center mt-2">
                        <Star className="text-yellow-400 mr-1" size={14} />
                        <span className="text-sm text-gray-600">
                          Sur 1,247 avis
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Star className="text-gray-600" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Revenus & Réservations
                      </h3>
                      <p className="text-sm text-gray-600">
                        Évolution sur les 7 derniers jours
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="7d">7 jours</option>
                        <option value="30d">30 jours</option>
                        <option value="90d">90 jours</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                        />
                        <YAxis hide />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#000000"
                          strokeWidth={2}
                          dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#000000" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Service Distribution */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Répartition des Services
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {serviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {serviceDistribution.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Réservations Récentes
                    </h3>
                    <button className="text-black hover:text-gray-700 text-sm font-medium">
                      Voir tout
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Réservation
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Professionnel
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Heure
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.clientName}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {booking.address}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {booking.serviceName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.professionalName}
                            </div>
                            {booking.rating && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                {booking.rating}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.time}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.price}€
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-600 hover:text-black">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-black">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-black">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && <AdminUser />}

          {/* Padding bottom pour éviter que le contenu soit coupé */}
          <div className="h-6"></div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  DollarSign,
  User,
  Search,
  Home,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Loader2,
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
import LocationDisplay from "../../components/LocationDisplay";

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
  latitude?: number;
  longitude?: number;
  rating?: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
  bookings?: number;
  revenue?: number;
}

interface DashboardStats {
  totalBookings: {
    value: number;
    growth: string;
    isPositive: boolean;
  };
  activeProfessionals: {
    value: number;
    growth: string;
    isPositive: boolean;
  };
  monthlyRevenue: {
    value: number;
    growth: string;
    isPositive: boolean;
  };
  averageRating: {
    value: number;
    totalReviews: number;
  };
}

interface ServiceDistribution {
  name: string;
  value: number;
  color: string;
}

interface DashboardData {
  stats: DashboardStats;
  revenueChart: ChartDataPoint[];
  serviceDistribution: ServiceDistribution[];
  recentBookings: ServiceBooking[];
}

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  // Fonction pour récupérer les données du dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/dashboardResume?period=${selectedPeriod}`
      );
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error || "Erreur lors du chargement des données");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error("Erreur lors du chargement du dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer le profil de l'admin
  const fetchAdminProfile = async () => {
    try {
      const response = await fetch("/api/admin-profile");
      const result = await response.json();

      if (result.success) {
        setAdminProfile(result.data);
      } else {
        console.error(
          "Erreur lors du chargement du profil admin:",
          result.error
        );
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil admin:", err);
    }
  };

  // Fonction pour obtenir le jour de la semaine en français
  const getDayOfWeek = () => {
    const days = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    return days[new Date().getDay()];
  };

  // Charger les données au montage du composant et lors du changement de période
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [selectedPeriod, activeTab]);

  // Charger le profil de l'admin au montage du composant
  useEffect(() => {
    fetchAdminProfile();
  }, []);

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
      <div className="flex-1 ml-64 h-screen flex flex-col">
        {/* Header Fixed */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {adminProfile
                  ? `Bon ${getDayOfWeek()}, ${adminProfile.lastName}`
                  : "Dashboard Admin"}
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
                  <div className="text-sm font-medium text-gray-900">
                    {adminProfile ? adminProfile.firstName : "Admin"}
                  </div>
                  <div className="text-xs text-gray-500">Administrateur</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Chargement du dashboard...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center">
                    <div className="text-red-600 mr-3">⚠️</div>
                    <div>
                      <h3 className="text-red-800 font-medium">
                        Erreur de chargement
                      </h3>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchDashboardData}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : dashboardData ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardData.stats.totalBookings.value.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Total Réservations
                          </p>
                          <div
                            className={`flex items-center mt-2 ${
                              dashboardData.stats.totalBookings.isPositive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {dashboardData.stats.totalBookings.isPositive ? (
                              <TrendingUp size={14} className="mr-1" />
                            ) : (
                              <TrendingDown size={14} className="mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {dashboardData.stats.totalBookings.growth}
                            </span>
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
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardData.stats.activeProfessionals.value}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Professionnels Actifs
                          </p>
                          <div
                            className={`flex items-center mt-2 ${
                              dashboardData.stats.activeProfessionals.isPositive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {dashboardData.stats.activeProfessionals
                              .isPositive ? (
                              <TrendingUp size={14} className="mr-1" />
                            ) : (
                              <TrendingDown size={14} className="mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {dashboardData.stats.activeProfessionals.growth}
                            </span>
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
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardData.stats.monthlyRevenue.value.toLocaleString()}
                            {""} FCFA
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Revenus ce mois
                          </p>
                          <div
                            className={`flex items-center mt-2 ${
                              dashboardData.stats.monthlyRevenue.isPositive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {dashboardData.stats.monthlyRevenue.isPositive ? (
                              <TrendingUp size={14} className="mr-1" />
                            ) : (
                              <TrendingDown size={14} className="mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {dashboardData.stats.monthlyRevenue.growth}
                            </span>
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
                          <p className="text-2xl font-bold text-gray-900">
                            {dashboardData.stats.averageRating.value}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Note Moyenne
                          </p>
                          <div className="flex items-center mt-2">
                            <Star className="text-yellow-400 mr-1" size={14} />
                            <span className="text-sm text-gray-600">
                              Sur{" "}
                              {dashboardData.stats.averageRating.totalReviews}{" "}
                              avis
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
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
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
                          </select>
                        </div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dashboardData.revenueChart}>
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
                              data={dashboardData.serviceDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {dashboardData.serviceDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                )
                              )}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 space-y-2">
                        {dashboardData.serviceDistribution.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-gray-700">
                                  {item.name}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">
                                {item.value}%
                              </span>
                            </div>
                          )
                        )}
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
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="text-left">
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Client
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Professionnel
                            </th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                              Localisation
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
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dashboardData.recentBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {booking.clientName}
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
                              <td className="px-4 py-3 whitespace-nowrap w-32">
                                <LocationDisplay
                                  latitude={booking.latitude}
                                  longitude={booking.longitude}
                                  fallbackAddress={booking.address}
                                  maxLength={20}
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(booking.date).toLocaleDateString(
                                    "fr-FR",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.time}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {booking.price}FCFA
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {activeTab === "users" && <AdminUser />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

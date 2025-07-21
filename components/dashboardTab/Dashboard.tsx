import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Star, 
  Euro, 
  CheckCircle, 
  AlertCircle,
  Settings,
  MapPin,
  Briefcase,
  Eye,
  ChevronRight,
  Zap
} from 'lucide-react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color: string;
  delay?: number;
}

interface QuickActionProps {
    title: string;
    icon: LucideIcon; // This includes 'size', 'color', 'className', etc.
    color: string;
}
interface Booking {
  id: number;
  client: string;
  service: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'accepted';
  price: string;
  avatar: React.ReactNode;
}

interface DashboardData {
  totalBookings: number;
  acceptanceRate: number;
  monthlyRevenue: number;
  avgRating: number;
  weeklyData: { name: string; reservations: number; revenus: number }[];
  recentBookings: Booking[];
  notifications: {
    newRequests: number;
    todayAppointments: number;
    pendingReviews: number;
  };
  ratingDistribution: { rating: number; count: number }[];
}

const Dashboard: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Données pour les graphiques - SERONT REMPLACÉES PAR LES DONNÉES DE L'API
  /*
  const weeklyData = [
    { name: 'Lun', reservations: 12, revenus: 450 },
    { name: 'Mar', reservations: 19, revenus: 680 },
    { name: 'Mer', reservations: 15, revenus: 520 },
    { name: 'Jeu', reservations: 25, revenus: 890 },
    { name: 'Ven', reservations: 22, revenus: 750 },
    { name: 'Sam', reservations: 30, revenus: 1200 },
    { name: 'Dim', reservations: 18, revenus: 640 }
  ];
  */

  // Données de réservations récentes - SERONT REMPLACÉES PAR LES DONNÉES DE L'API
  /*
  const recentBookings: Booking[] = [
    { id: 1, client: 'Marie Dubois', service: 'Ménage Premium', date: '2025-07-20', status: 'confirmed', price: '€85', avatar: <User size={30} /> },
    { id: 2, client: 'Pierre Martin', service: 'Jardinage Complet', date: '2025-07-21', status: 'pending', price: '€120', avatar: <User size={30} /> },
    { id: 3, client: 'Sophie Bernard', service: 'Nettoyage Vitres', date: '2025-07-22', status: 'confirmed', price: '€65', avatar: <User size={30} /> },
    { id: 4, client: 'Lucas Petit', service: 'Bricolage', date: '2025-07-23', status: 'pending', price: '€95', avatar: <User size={30} /> }
  ];
  */

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color, delay = 0 }) => (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-6 text-white shadow-2xl transition-all duration-700 hover:scale-105 hover:shadow-3xl ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setActiveCard(title)}
      onMouseLeave={() => setActiveCard(null)}
    >
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1 text-white/90">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">+{trend}%</span>
            </div>
          )}
        </div>
        <div className="relative">
          <div className={`absolute inset-0 rounded-full bg-white/20 blur-xl transition-all duration-300 ${activeCard === title ? 'scale-150' : 'scale-100'}`} />
          <Icon size={32} className="relative z-10 opacity-80" />
        </div>
      </div>
    </div>
  );

  const QuickAction: React.FC<QuickActionProps> = ({ title, icon: Icon, color }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:scale-105">
      <div className="flex items-center space-x-3">
        <div className={`rounded-xl p-2 ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="font-medium text-gray-700">{title}</span>
        <ChevronRight size={16} className="text-gray-400 ml-auto transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">Chargement des données du tableau de bord...</p>
                {/* Vous pouvez ajouter un spinner ici */}
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center p-8 bg-white/70 rounded-3xl shadow-2xl">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-800">Erreur</h2>
                <p className="text-red-600 mt-2">{error}</p>
            </div>
        </div>
    );
  }

  if (!dashboardData) {
      return null; // Ou un autre état de secours
  }

  // Calcul dynamique pour la répartition des avis
  const totalReviews = dashboardData.ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const ratingData = dashboardData.ratingDistribution.map(r => ({
    name: `${r.rating}★`,
    value: totalReviews > 0 ? Math.round((r.count / totalReviews) * 100) : 0,
    count: r.count,
    color: r.rating === 5 ? '#10B981' : r.rating === 4 ? '#F59E0B' : r.rating === 3 ? '#EF4444' : r.rating === 2 ? '#6B7280' : '#A3A3A3',
  }));


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header avec animations */}
      <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Tableau de Bord
            </h1>
            <p className="text-gray-600 mt-2">Gérez votre activité en temps réel</p>
          </div>
          
          
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Réservations Totales"
          value={String(dashboardData.totalBookings)}
          icon={Calendar}
          color="bg-gradient-to-r from-blue-600 to-blue-800 bg-opacity-60"
          delay={100}
        />
        <StatCard
          title="Taux d'Acceptation"
          value={`${dashboardData.acceptanceRate}%`}
          icon={CheckCircle}
          color="from-emerald-600 to-emerald-800"
          delay={200}
        />
        <StatCard
          title="Revenus ce Mois"
          value={`€${dashboardData.monthlyRevenue}`}
          icon={Euro}
          color="from-purple-600 to-purple-800"
          delay={300}
        />
        <StatCard
          title="Note Moyenne"
          value={String(dashboardData.avgRating)}
          icon={Star}
          color="from-amber-600 to-amber-800"
          delay={400}
        />
      </div>

      {/* Section graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique principal */}
        <div className={`lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 p-6 shadow-2xl transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Performance Hebdomadaire</h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Réservations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Revenus</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.weeklyData}>
              <defs>
                <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="reservations"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorReservations)"
              />
              <Area
                type="monotone"
                dataKey="revenus"
                stroke="#8B5CF6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenus)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des avis */}
        <div className={`rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 p-6 shadow-2xl transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Répartition des Avis</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '12px'
                }}
                formatter={(value, name, props) => [`${props.payload.count} avis (${value}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-2 mt-4">
            {ratingData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600">{item.value}% ({item.count} avis)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Réservations récentes et actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Réservations récentes */}
        <div className={`lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 p-6 shadow-2xl transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Dernières Réservations</h3>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <Eye size={16} />
              <span>Voir tout</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 hover:from-white/70 hover:to-white/50 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br bg-white/40 flex items-center justify-center text-xl">
                    {booking.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{booking.client}</h4>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg text-gray-900">{booking.price}</span>
                  <div
  className={`px-3 py-1 rounded-full text-xs font-medium ${
    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
    booking.status === 'accepted' ? 'bg-green-100 text-green-700' :
    booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
    booking.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
    'bg-gray-100 text-gray-700' // fallback
  }`}
>
  {
    booking.status === 'pending' ? 'En attente' :
    booking.status === 'accepted' ? 'Acceptée' :
    booking.status === 'completed' ? 'Terminée' :
    booking.status === 'cancelled' ? 'Annulée' :
    'Inconnu'
  }
</div>
                  <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className={`rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 p-6 shadow-2xl transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h3>
          
          <div className="space-y-4">
            <QuickAction 
              title="Gérer Disponibilités"
              icon={Calendar}
              color="bg-gray-400"
            />
            <QuickAction 
              title="Modifier Profil"
              icon={Settings}
              color="bg-gray-400"
            />
            <QuickAction 
              title="Gérer Localisation"
              icon={MapPin}
              color="bg-gray-400"
            />
            <QuickAction 
              title="Services Offerts"
              icon={Briefcase}
              color="bg-gray-400"
            />
          </div>

          {/* Alertes/Notifications */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
            <div className="flex items-center space-x-3 mb-3">
              <AlertCircle size={20} className="text-red-500" />
              <h4 className="font-semibold text-red-900">Notifications</h4>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-red-700">• {dashboardData.notifications.newRequests} nouvelles demandes à traiter</p>
              <p className="text-red-700">• {dashboardData.notifications.todayAppointments} rendez-vous aujourd&apos;hui</p>
              <p className="text-red-700">• {dashboardData.notifications.pendingReviews} avis en attente de réponse</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec micro-animations */}
      <div className={`text-center text-gray-500 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
        <p className="flex items-center justify-center space-x-2">
          <Zap size={16} className="text-yellow-500" />
          <span>Dashboard mis à jour en temps réel</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
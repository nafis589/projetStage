"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";

// Types pour les utilisateurs
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "professionnel" | "admin";
  registrationDate: string;
  status: "actif" | "inactif";
  avatar?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      limit: number;
    };
    stats: {
      total: number;
      active: number;
      inactive: number;
    };
  };
  error?: string;
}

// Modal de confirmation de suppression
interface DeleteModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-transparent  flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Supprimer l&apos;utilisateur
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>{" "}
          ? Cette action est irréversible.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        role: roleFilter,
      });

      const response = await fetch(`/api/AdminUser?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      } else {
        console.error(
          "Erreur lors du chargement des utilisateurs:",
          data.error
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant et lors des changements de filtres
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  // Fonction pour changer le statut d'un utilisateur
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      setActionLoading(userId);
      const newStatus = currentStatus === "actif" ? "inactif" : "actif";

      const response = await fetch("/api/AdminUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action: "toggleStatus",
          newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour l'état local
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, status: newStatus as "actif" | "inactif" }
              : user
          )
        );
        // Recharger les statistiques
        fetchUsers();
      } else {
        console.error("Erreur lors du changement de statut:", data.error);
        alert("Erreur lors du changement de statut de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors du changement de statut de l'utilisateur");
    } finally {
      setActionLoading(null);
    }
  };

  
  // Fonction pour supprimer un utilisateur
  const deleteUser = async (userId: string) => {
    try {
      setActionLoading(userId);

      const response = await fetch(`/api/AdminUser?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Supprimer de l'état local
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setDeleteModal({ isOpen: false, user: null });
        // Recharger les données pour mettre à jour les statistiques et la pagination
        fetchUsers();
      } else {
        console.error("Erreur lors de la suppression:", data.error);
        alert("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "professionnel":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "actif"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Réinitialiser la page lors du changement de filtres
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
        </div>
        <p className="text-gray-600">
          Gérez tous les utilisateurs de la plateforme
        </p>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Filtre par rôle */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tous les rôles</option>
                <option value="client">Clients</option>
                <option value="professionnel">Professionnels</option>
                <option value="admin">Administrateurs</option>
              </select>
            </div>
          </div>

          {/* Statistiques */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">{stats.total}</span>{" "}
              utilisateur(s)
            </div>
            <div>
              <span className="font-medium text-green-600">{stats.active}</span>{" "}
              actif(s)
            </div>
            <div>
              <span className="font-medium text-red-600">{stats.inactive}</span>{" "}
              inactif(s)
            </div>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chargement des utilisateurs...
            </h3>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600">
              Aucun utilisateur ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d&apos;inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        user.status === "inactif" ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role === "professionnel" ? "Professionnel" : 
                           user.role === "client" ? "Client" : 
                           user.role === "admin" ? "Admin" : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.registrationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          {/* Toggle Actif/Inactif */}
                          <button
                            onClick={() =>
                              toggleUserStatus(user.id, user.status)
                            }
                            disabled={actionLoading === user.id}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === "actif"
                                ? "text-green-600 hover:bg-green-100"
                                : "text-red-600 hover:bg-red-100"
                            } ${
                              actionLoading === user.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              user.status === "actif" ? "Désactiver" : "Activer"
                            }
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : user.status === "actif" ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>

                          {/* Modifier */}
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Supprimer */}
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, user })
                            }
                            disabled={actionLoading === user.id}
                            className={`p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ${
                              actionLoading === user.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Plus d'options */}
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.limit + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalUsers
                      )}
                    </span>{" "}
                    sur{" "}
                    <span className="font-medium">{pagination.totalUsers}</span>{" "}
                    résultats
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1 || loading}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">
                      Page {pagination.currentPage} sur {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, pagination.totalPages)
                        )
                      }
                      disabled={
                        currentPage === pagination.totalPages || loading
                      }
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de suppression */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        user={deleteModal.user}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => deleteModal.user && deleteUser(deleteModal.user.id)}
        isLoading={actionLoading !== null}
      />
    </div>
  );
};

export default AdminUser;

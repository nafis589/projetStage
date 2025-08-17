"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  Clock,
  Calendar,
  MapPin,
  LogOut,
  Mail,
  Menu,
  X,
} from "lucide-react";
import CustomMap from "../../../../components/CustomMap";
import SearchResults from "../../../../app/components/SearchResults";
import BookingHistory from "../../../../app/components/BookingHistory";

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
  latitude?: number;
  longitude?: number;
}

interface ClientProfile {
  firstname: string;
  lastname: string;
  email: string;
  address: string | null;
  city: string | null;
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("course");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const memoizedCenter = useMemo<[number, number]>(() => {
    return userLocation
      ? [userLocation.lng, userLocation.lat]
      : [1.2228, 6.1319]; // exemple (lat, lng)
  }, [userLocation]);

  const memoizedMarkers = useMemo(() => {
    return [
      ...professionals.map((p) => ({
        id: p.id,
        latitude: p.latitude || 0,
        longitude: p.longitude || 0,
        isSelected: selectedProfessional?.id === p.id,
        isUser: false,
      })),
      ...(userLocation
        ? [
            {
              id: "user-location",
              latitude: userLocation.lat,
              longitude: userLocation.lng,
              isUser: true,
            },
          ]
        : []),
    ].filter((marker) => marker.latitude !== 0 && marker.longitude !== 0);
  }, [professionals, selectedProfessional, userLocation]);

  const dateRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const userModalRef = useRef<HTMLDivElement | null>(null);
  const userMenuContainerRef = useRef<HTMLDivElement | null>(null);

  // Générer les options d'heures
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

  // Générer le calendrier pour un mois donné
  const generateCalendar = (year: number, month: number): (Date | null)[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Jours vides avant le début du mois
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const calendarDays = generateCalendar(currentYear, currentMonth);

  const monthNames: string[] = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames: string[] = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Fermer les popups quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
      if (
        userMenuContainerRef.current &&
        !userMenuContainerRef.current.contains(event.target as Node)
      ) {
        setShowUserModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (selectedProfessional) {
        // Find the professional in the list to check if we already have the location
        const professionalInList = professionals.find(
          (p) => p.id === selectedProfessional.id
        );

        // If we don't have lat/lng, fetch it.
        if (
          professionalInList &&
          (professionalInList.latitude === null ||
            professionalInList.longitude === null ||
            professionalInList.latitude === undefined ||
            professionalInList.longitude === undefined)
        ) {
          try {
            const response = await fetch(
              `/api/location?userId=${selectedProfessional.id}`
            );
            if (response.ok) {
              const locationData = await response.json();
              if (locationData) {
                setProfessionals((prev) =>
                  prev.map((p) =>
                    p.id === selectedProfessional.id
                      ? {
                          ...p,
                          latitude: locationData.latitude,
                          longitude: locationData.longitude,
                        }
                      : p
                  )
                );
              }
            }
          } catch (error) {
            console.error("Failed to fetch professional location:", error);
          }
        }
      }
    };

    fetchLocation();
  }, [selectedProfessional, professionals]);

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      if (date.getTime() >= todayStart.getTime()) {
        setSelectedDate(date.toISOString().split("T")[0]);
        setShowDatePicker(false);
      }
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return date.toISOString().split("T")[0] === selectedDate;
  };

  const isPastDate = (date: Date | null): boolean => {
    if (!date) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // Optionally, you can use a reverse geocoding service to get the address
          setDropoffLocation(`Position actuelle`);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Handle error (e.g., show a toast notification)
          alert(
            "Impossible d'obtenir la position. Veuillez autoriser la géolocalisation."
          );
          setIsLocating(false);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      setIsLocating(false);
    }
  };

  // Fonction de recherche
  const handleSearch = async () => {
    if (!pickupLocation) {
      alert("Veuillez entrer un service à rechercher.");
      return;
    }
    if (!userLocation) {
      alert("Veuillez fournir votre localisation.");
      return;
    }

    const params = new URLSearchParams({
      service: pickupLocation,
      latitude: userLocation.lat.toString(),
      longitude: userLocation.lng.toString(),
    });

    if (selectedDate) {
      params.append("date", selectedDate);
    }
    if (selectedTime) {
      params.append("time", selectedTime);
    }

    try {
      const response = await fetch(
        `/api/professionals/search?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProfessionals(data);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to fetch professionals:", error);
      // Handle error, e.g., show a toast
    }
  };

  useEffect(() => {
    const fetchClientProfile = async () => {
      console.log(session);
      if (session) {
        try {
          console.log(session);
          const response = await fetch("/api/clientProfil", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setClientProfile(data);
          } else {
            const errorText = await response.text();
            console.error(
              "Failed to fetch client profile",
              response.status,
              errorText
            );
          }
        } catch (error) {
          console.error("Error fetching client profile:", error);
        }
      }
    };

    fetchClientProfile();
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user && session.user.role !== "client") {
      router.push("/dashboard/professional");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Chargement...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 gap-3">
          {/* Logo + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
              aria-label="Ouvrir le menu"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-2xl font-bold">Geservice</h1>
          </div>

          {/* Tabs */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => setActiveTab("course")}
              className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                activeTab === "course"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="font-medium">Reservation</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="font-medium">Historique</span>
            </button>
          </div>

          {/* User Section */}
          <div
            className="relative"
            ref={userMenuContainerRef}
            onMouseEnter={() => setShowUserModal(true)}
            onMouseLeave={() => setShowUserModal(false)}
          >
            <div
              ref={userModalRef}
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setShowUserModal((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showUserModal}
            >
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Activité</span>
              </div>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>

            {/* User Modal - Black & White Design */}
            {showUserModal && (
              <div
                className="absolute top-full right-0 mt-4 w-80 bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 z-50 overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-top-2"
                style={{
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header with black background */}
                <div className="relative bg-white p-6 text-black">
                  <div className="flex flex-col items-center">
                    {/* Avatar with status indicator */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-black/20">
                        <User className="w-10 h-10 text-black" />
                      </div>
                    </div>

                    {/* User name */}
                    <h3 className="font-bold text-2xl text-center mb-1 drop-shadow-sm">
                      {clientProfile
                        ? `${clientProfile.firstname} ${clientProfile.lastname}`
                        : session?.user?.name || "Utilisateur"}
                    </h3>

                    {/* Status badge */}
                    <div className="bg-gray/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      <span className="text-xs font-medium text-black">
                        Client
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-6 space-y-4">
                  {/* User details */}
                  <div className="space-y-3">
                    {clientProfile?.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Email
                          </p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {clientProfile.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {(clientProfile?.address || clientProfile?.city) && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Adresse
                          </p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {clientProfile.address}
                            {clientProfile.city
                              ? `, ${clientProfile.city}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Logout button */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-center gap-3 bg-red-50/50 hover:bg-red-50 text-red-600 py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold group"
                  >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setActiveTab("course");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === "course"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Reservation
              </button>
              <button
                onClick={() => {
                  setActiveTab("history");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeTab === "history"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Historique
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeTab === "course" && (
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Form Sidebar */}
          <div className="w-full lg:w-96 shrink-0 bg-white shadow-lg flex flex-col">
            {/* Form Header */}
            <div className="p-6">
              <h2 className="text-xl font-semibold">
                Rechercher un professionel
              </h2>
            </div>

            {/* Form Content */}
            <div className="bg-white p-6 md:max-w-md">
              {/* Location Inputs */}
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Quel service rechercher vous?"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Entrez votre adresse"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    readOnly={!!userLocation}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Utiliser ma position actuelle"
                  >
                    {isLocating ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MapPin size={18} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Time Selection */}
              <div className="flex gap-2 mb-6">
                {/* Date Input */}
                <div ref={dateRef} className="relative flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Date
                  </label>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-700">
                        {selectedDate
                          ? new Date(selectedDate).toLocaleDateString("fr-FR")
                          : "Aujourd'hui"}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {/* Date Popover avec Calendrier */}
                  {showDatePicker && (
                    <div className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:left-0 md:mb-2 bg-white border border-gray-200 rounded-t-2xl md:rounded-lg shadow-2xl z-50 p-4 w-full md:w-80 max-h-[70vh] overflow-y-auto">
                      {/* En-tête du calendrier */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={goToPreviousMonth}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className="rotate-90 text-gray-600"
                          />
                        </button>
                        <h3 className="font-semibold text-gray-800">
                          {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button
                          onClick={goToNextMonth}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronDown
                            size={16}
                            className="-rotate-90 text-gray-600"
                          />
                        </button>
                      </div>

                      {/* Jours de la semaine */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                          <div
                            key={day}
                            className="text-center text-xs font-medium text-gray-500 py-2"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Grille du calendrier */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            disabled={!date || isPastDate(date)}
                            className={`
                              h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
                              ${!date ? "invisible" : ""}
                              ${
                                isPastDate(date)
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "hover:bg-gray-100 cursor-pointer"
                              }
                              ${
                                isToday(date)
                                  ? "bg-blue-100 text-blue-600 font-bold"
                                  : "text-gray-700"
                              }
                              ${
                                isSelected(date)
                                  ? "bg-black text-white hover:bg-gray-800"
                                  : ""
                              }
                            `}
                          >
                            {date?.getDate()}
                          </button>
                        ))}
                      </div>

                      {/* Boutons rapides */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleDateSelect(new Date())}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Aujourd&apos;hui
                        </button>
                        <button
                          onClick={() =>
                            handleDateSelect(
                              new Date(Date.now() + 24 * 60 * 60 * 1000)
                            )
                          }
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Demain
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Time Input */}
                <div ref={timeRef} className="relative flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    Heure
                  </label>
                  <button
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-700">
                        {selectedTime || "Maintenant"}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>

                  {/* Time Popover */}
                  {showTimePicker && (
                    <div className="fixed inset-x-0 bottom-0 md:absolute md:top-full md:left-0 md:right-0 md:mt-2 bg-white border border-gray-200 rounded-t-2xl md:rounded-lg shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
                      <div className="p-2">
                        <button
                          onClick={() => handleTimeSelect("")}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
                        >
                          Maintenant
                        </button>
                        {timeOptions.map((time, index) => (
                          <button
                            key={index}
                            onClick={() => handleTimeSelect(time)}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <button
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  onClick={handleSearch}
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="w-full lg:w-[480px] max-w-full order-3 lg:order-none">
              <SearchResults
                professionals={professionals}
                selectedProfessional={selectedProfessional}
                onProfessionalSelect={setSelectedProfessional}
                userLocation={userLocation}
              />
            </div>
          )}

          {/* Map Container */}
          <div
            className={`relative w-full transition-all duration-300 order-2 lg:order-none ${
              showResults ? "lg:flex-1" : "lg:flex-[2]"
            }`}
          >
            <CustomMap
              id="client-dashboard-map"
              key="client-dashboard-map"
              center={memoizedCenter}
              zoom={13}
              className="w-full h-[45vh] sm:h-[50vh] lg:h-full"
              markers={memoizedMarkers}
            />
          </div>
        </div>
      )}
      {activeTab === "history" && <BookingHistory />}
    </div>
  );
}

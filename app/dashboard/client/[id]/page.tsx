"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Clock, Calendar, MapPin } from "lucide-react";
import CustomMap from "../../../../components/CustomMap";
import SearchResults from "../../../../app/components/SearchResults";

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
  latitude?: number;
  longitude?: number;
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("course");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const dateRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          alert("Impossible d'obtenir la position. Veuillez autoriser la géolocalisation.");
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
        params.append('date', selectedDate);
    }
    if (selectedTime) {
        params.append('time', selectedTime);
    }

    try {
        const response = await fetch(`/api/professionals/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
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
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Geservice</h1>

          {/* Tabs */}
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("course")}
              className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                activeTab === "course"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">Reservation</span>
            </button>
            <button
              onClick={() => setActiveTab("courier")}
              className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                activeTab === "courier"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-gray-400 rounded-sm"></div>
              </div>
              <span className="font-medium">Courier</span>
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Activité</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Form Sidebar */}
        <div className="w-96 bg-white shadow-lg flex flex-col">
          {/* Form Header */}
          <div className="p-6">
            <h2 className="text-xl font-semibold">
              Rechercher un professionel
            </h2>
          </div>

          {/* Form Content */}
          <div className="bg-white p-6 max-w-md">
            {/* Location Inputs */}
            <div className="space-y-4 mb-4">
              <div className="relative">
                <div className="absolute left-3 top-3 w-3 h-3 bg-black rounded-full"></div>
                <input
                  type="text"
                  placeholder="Quel service rechercher vous?"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 w-3 h-3 bg-gray-400 rounded-sm"></div>
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
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
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
                  <div className="absolute top-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
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
          <SearchResults
            professionals={professionals}
            selectedProfessional={selectedProfessional}
            onProfessionalSelect={setSelectedProfessional}
            userLocation={userLocation}
          />
        )}

        {/* Map Container */}
        <div className={`relative transition-all duration-300 ${showResults ? 'flex-1' : 'flex-[2]'}`}>
          <CustomMap
            id="client-dashboard-map"
            center={userLocation ? [userLocation.lng, userLocation.lat] : [1.2228, 6.1319]} // Corrected to [lng, lat]
            zoom={13}
            className="w-full h-full"
            markers={[
              ...professionals.map(p => ({
                id: p.id,
                latitude: p.latitude || 0,
                longitude: p.longitude || 0,
                isSelected: selectedProfessional?.id === p.id,
                isUser: false
              })),
              ...(userLocation ? [{
                id: 'user-location',
                latitude: userLocation.lat,
                longitude: userLocation.lng,
                isUser: true
              }] : [])
            ].filter(marker => marker.latitude !== 0 && marker.longitude !== 0)}
          />
        </div>
      </div>
    </div>
  );
}

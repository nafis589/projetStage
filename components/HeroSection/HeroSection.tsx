
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, ChevronDown } from "lucide-react";
import Image from 'next/image';


const HeroSection = () => {
    const [pickupLocation, setPickupLocation] = useState<string>('');  
  const [dropoffLocation, setDropoffLocation] = useState<string>('');  
  const [selectedDate, setSelectedDate] = useState<string>('');  
  const [selectedTime, setSelectedTime] = useState<string>('');  
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);  
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const dateRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);

  // Générer les options d'heures
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Fermer les popups quand on clique à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleDateSelect = (date: Date | null) => {
    if (date && date.getTime() >= today.setHours(0, 0, 0, 0)) {
      setSelectedDate(date.toISOString().split('T')[0]);
      setShowDatePicker(false);
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
    return date.toISOString().split('T')[0] === selectedDate;
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

  
    return (
      <section className="pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-black mb-8 leading-tight">
                Simplifier la <br />gestion de vos services
              </h1>
              
              {/* Booking Form */}
              <div className="bg-white p-6 max-w-md">
                {/* Ride Type Toggle */}
                
                
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
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
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  {/* Date Popover avec Calendrier */}
                  {showDatePicker && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 w-80">
                      {/* En-tête du calendrier */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={goToPreviousMonth}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronDown size={16} className="rotate-90 text-gray-600" />
                        </button>
                        <h3 className="font-semibold text-gray-800">
                          {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button
                          onClick={goToNextMonth}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronDown size={16} className="-rotate-90 text-gray-600" />
                        </button>
                      </div>

                      {/* Jours de la semaine */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
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
                              ${!date ? 'invisible' : ''}
                              ${isPastDate(date) 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'hover:bg-gray-100 cursor-pointer'
                              }
                              ${isToday(date) 
                                ? 'bg-blue-100 text-blue-600 font-bold' 
                                : 'text-gray-700'
                              }
                              ${isSelected(date) 
                                ? 'bg-black text-white hover:bg-gray-800' 
                                : ''
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
                          onClick={() => handleDateSelect(new Date(Date.now() + 24 * 60 * 60 * 1000))}
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
                  <label className="text-xs text-gray-500 mb-1 block">Heure</label>
                  <button
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-700">
                        {selectedTime || 'Maintenant'}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  {/* Time Popover */}
                  {showTimePicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <button
                          onClick={() => handleTimeSelect('')}
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

                
                {/* Get Quote Button */}
                <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Voir les prix
                </button>
              </div>
              
              <div className="mt-4">
                <button className="text-gray-600 underline hover:text-black transition-colors">
                  Log in to see your recent activity
                </button>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative">
            <Image
  src="/landingimg.jpg"
  alt="People getting into Uber"
  width={1200}  // or appropriate width
  height={384} // h-96 = 384px
  className="object-cover rounded-lg shadow-2xl w-full h-96"
/>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  // Suggestions Section Component
  
  
  // Login Activity Section Component
  

  export default HeroSection;

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface Booking {
  id: number;
  service: string;
  location: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_time: string;
  prof_firstname: string;
  prof_lastname: string;
}

type ApiBooking = Omit<Booking, 'price'> & {
  price: string | number;
};

const BookingStatusIcon = ({ status }: { status: Booking['status'] }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="text-green-500" size={20} />;
    case 'confirmed':
      return <Clock className="text-blue-500" size={20} />;
    case 'cancelled':
      return <XCircle className="text-red-500" size={20} />;
    case 'pending':
      return <AlertCircle className="text-yellow-500" size={20} />;
    default:
      return null;
  }
};

const BookingStatusBadge = ({ status }: { status: Booking['status'] }) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5";
  const statusClasses = {
    completed: "bg-green-100 text-green-800",
    confirmed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      <BookingStatusIcon status={status} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

const BookingHistorySkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border-t border-gray-200 px-6 py-4">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: ApiBooking[] = await response.json();
        const bookingsWithNumericPrice: Booking[] = data.map((booking) => ({
          ...booking,
          price: Number(booking.price),
        }));
        setBookings(bookingsWithNumericPrice);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue s&apos;est produite");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique des réservations</h2>
        
        {loading && <BookingHistorySkeleton />}

        {!loading && error && (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
             <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
             <h3 className="mt-2 text-lg font-medium text-gray-900">Oops, une erreur est survenue</h3>
             <p className="mt-1 text-sm text-gray-500">{error}</p>
             <div className="mt-6">
                 <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                 >
                     <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                     Réessayer
                 </button>
             </div>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune réservation</h3>
            <p className="mt-1 text-sm text-gray-500">Vous n&apos;avez pas encore de réservation.</p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professionnel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const bookingDate = new Date(booking.booking_time);
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-full">
                              <Briefcase size={16} className="text-gray-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{booking.service}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`${booking.prof_firstname} ${booking.prof_lastname}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>{bookingDate.toLocaleDateString('fr-FR')}</span>
                            <span className="text-gray-400">
                              {bookingDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{booking.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-1 font-medium text-gray-900">
                            <DollarSign size={14} className="text-gray-400" />
                            <span>{booking.price.toFixed(2)} €</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <BookingStatusBadge status={booking.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
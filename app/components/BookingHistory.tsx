
import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, DollarSign, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

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

const BookingCard = ({ booking }: { booking: Booking }) => {
  const { service, status, booking_time, prof_firstname, prof_lastname, price } = booking;
  const professionalName = `${prof_firstname} ${prof_lastname}`;
  const bookingDate = new Date(booking_time);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Briefcase size={20} className="text-gray-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800 tracking-wide">{service}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Avec {professionalName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookingStatusIcon status={status} />
            <span className="capitalize">{status}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>{bookingDate.toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span>{bookingDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <MapPin size={16} className="text-gray-400" />
              <span>{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <DollarSign size={16} className="text-gray-400" />
              <span>{price.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingHistorySkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded col-span-2"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        ))}
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
      <div className="max-w-4xl mx-auto">
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
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
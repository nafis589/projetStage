import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/util/db";
import util from "util";

const query = util.promisify(db.query).bind(db);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'professional') {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const professionalId = session.user.id;

  try {
    // 1. Réservations totales
    const totalBookingsResult = await query(
      "SELECT COUNT(*) as totalBookings FROM bookings WHERE professional_id = ?",
      [professionalId]
    );
    const totalBookings = totalBookingsResult[0] && totalBookingsResult[0].totalBookings ? totalBookingsResult[0].totalBookings : 0;

    // 2. Taux d'acceptation (confirmées / (confirmées + annulées par pro))
    const acceptanceRateResult = await query(
        `SELECT 
            SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
            SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM bookings 
        WHERE professional_id = ?`,
        [professionalId]
    );
    const confirmedCount = acceptanceRateResult[0] && acceptanceRateResult[0].confirmed ? acceptanceRateResult[0].confirmed : 0;
    const cancelledCount = acceptanceRateResult[0] && acceptanceRateResult[0].cancelled ? acceptanceRateResult[0].cancelled : 0;
    const acceptanceRate = (confirmedCount + cancelledCount) > 0 ? (confirmedCount / (confirmedCount + cancelledCount)) * 100 : 100;

    // 3. Revenus ce mois-ci
    const monthlyRevenueResult = await query(
      `SELECT SUM(price) as monthlyRevenue FROM bookings WHERE professional_id = ? AND status = 'completed' AND MONTH(booking_time) = MONTH(CURDATE()) AND YEAR(booking_time) = YEAR(CURDATE())`,
      [professionalId]
    );
    const monthlyRevenue = monthlyRevenueResult[0] && monthlyRevenueResult[0].monthlyRevenue ? monthlyRevenueResult[0].monthlyRevenue : 0;

    // 4. Note moyenne (suppose une table 'reviews')
    const avgRatingResult = await query(
        "SELECT AVG(rating) as avgRating FROM reviews WHERE professional_id = ?",
        [professionalId]
    );
    let avgRating = avgRatingResult[0] && avgRatingResult[0].avgRating != null ? Number(avgRatingResult[0].avgRating) : 0;
    avgRating = Number.isFinite(avgRating) ? avgRating : 0;

    // Répartition des avis (nombre d'avis par note)
    const ratingDistributionResult = await query(
      'SELECT rating, COUNT(*) as count FROM reviews WHERE professional_id = ? GROUP BY rating',
      [professionalId]
    );
    // Format: [{ rating: 5, count: 10 }, ...]
    const ratingDistribution = [1,2,3,4,5].map(rating => {
      const found = ratingDistributionResult.find(r => Number(r.rating) === rating);
      return { rating, count: found ? Number(found.count) : 0 };
    });

    // 5. Performance hebdomadaire (7 derniers jours)
    const weeklyPerformanceResult = await query(
        `SELECT 
            DATE(booking_time) as date, 
            COUNT(*) as reservations, 
            SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END) as revenus 
        FROM bookings 
        WHERE professional_id = ? AND booking_time >= CURDATE() - INTERVAL 7 DAY 
        GROUP BY DATE(booking_time) 
        ORDER BY DATE(booking_time) ASC`,
        [professionalId]
    );

    const weeklyData = Array(7).fill(null).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
        const dateString = d.toISOString().split('T')[0];
        const dayData = weeklyPerformanceResult.find((r) => {
          const rDate = r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date;
          return rDate === dateString;
        });
        return {
            name: dayName,
            reservations: dayData ? dayData.reservations : 0,
            revenus: dayData ? dayData.revenus : 0
        };
    }).reverse();

    // 6. Dernières réservations
    const recentBookings = await query(
      `SELECT b.id, u.firstname as client_firstname, u.lastname as client_lastname, b.service, b.booking_time, b.status, b.price
       FROM bookings b
       JOIN users u ON b.client_id = u.id
       WHERE b.professional_id = ? 
       ORDER BY b.booking_time DESC
       LIMIT 4`,
      [professionalId]
    );
    
    // 7. Notifications (demandes en attente)
    const pendingRequestsResult = await query(
        "SELECT COUNT(*) as pendingRequests FROM bookings WHERE professional_id = ? AND status = 'pending'",
        [professionalId]
    );
    const pendingRequests = pendingRequestsResult[0] && pendingRequestsResult[0].pendingRequests ? pendingRequestsResult[0].pendingRequests : 0;

    // 8. Rendez-vous aujourd'hui
    const todaysAppointmentsResult = await query(
        "SELECT COUNT(*) as todaysAppointments FROM bookings WHERE professional_id = ? AND DATE(booking_time) = CURDATE()",
        [professionalId]
    );
    const todaysAppointments = todaysAppointmentsResult[0] && todaysAppointmentsResult[0].todaysAppointments ? todaysAppointmentsResult[0].todaysAppointments : 0;

    // 9. Avis en attente de réponse (suppose une colonne 'is_replied' dans 'reviews')
    const pendingReviewsResult = await query(
        "SELECT COUNT(*) as pendingReviews FROM reviews WHERE professional_id = ? AND is_replied = 0",
        [professionalId]
    );
    const pendingReviews = pendingReviewsResult[0] && pendingReviewsResult[0].pendingReviews ? pendingReviewsResult[0].pendingReviews : 0;

    return NextResponse.json({
      totalBookings,
      acceptanceRate: parseFloat(acceptanceRate.toFixed(0)),
      monthlyRevenue,
      avgRating: Number(avgRating.toFixed(1)),
      ratingDistribution,
      weeklyData,
      recentBookings: recentBookings.map((b) => ({
        id: b.id,
        client: `${b.client_firstname} ${b.client_lastname}`,
        service: b.service,
        date: b.booking_time,
        status: b.status,
        price: `${b.price} FCFA`,
        avatar: "User" // Placeholder, to be handled on the frontend
      })),
      notifications: {
          newRequests: pendingRequests,
          todayAppointments: todaysAppointments,
          pendingReviews: pendingReviews
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur API Dashboard:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
} 
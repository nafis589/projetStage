import { NextResponse } from 'next/server';
import util from 'util';
import db from '@/util/db';

const query = util.promisify(db.query).bind(db);

// GET - Récupérer toutes les données du dashboard admin
export async function GET(request) {
  try {
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    // Calculer les dates selon la période
    let dateFilter = '';
    let daysCount = 7;
    
    switch (period) {
      case '7d':
        dateFilter = 'DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        daysCount = 7;
        break;
      case '30d':
        dateFilter = 'DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        daysCount = 30;
        break;
      case '90d':
        dateFilter = 'DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)';
        daysCount = 90;
        break;
      default:
        dateFilter = 'DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        daysCount = 7;
    }

    // 1. STATISTIQUES PRINCIPALES
    
    // Total des réservations
    const totalBookingsResult = await query(`
      SELECT COUNT(*) as total_bookings
      FROM bookings
    `);
    
    // Total des réservations de la période précédente pour calculer le pourcentage
    const previousPeriodBookingsResult = await query(`
      SELECT COUNT(*) as previous_bookings
      FROM bookings
      WHERE DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL ${daysCount * 2} DAY)
      AND DATE(booking_time) < DATE_SUB(CURDATE(), INTERVAL ${daysCount} DAY)
    `);
    
    // Professionnels actifs (qui ont au moins une réservation dans les 30 derniers jours)
    const activeProfessionalsResult = await query(`
      SELECT COUNT(DISTINCT professional_id) as active_professionals
      FROM bookings
      WHERE DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Professionnels actifs période précédente
    const previousActiveProfessionalsResult = await query(`
      SELECT COUNT(DISTINCT professional_id) as previous_active_professionals
      FROM bookings
      WHERE DATE(booking_time) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
      AND DATE(booking_time) < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    
    // Revenus du mois en cours
    const currentMonthRevenueResult = await query(`
      SELECT COALESCE(SUM(price), 0) as current_month_revenue
      FROM bookings
      WHERE YEAR(booking_time) = YEAR(CURDATE()) 
      AND MONTH(booking_time) = MONTH(CURDATE())
      AND status IN ('completed', 'accepted')
    `);
    
    // Revenus du mois précédent
    const previousMonthRevenueResult = await query(`
      SELECT COALESCE(SUM(price), 0) as previous_month_revenue
      FROM bookings
      WHERE YEAR(booking_time) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND MONTH(booking_time) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND status IN ('completed', 'accepted')
    `);
    
    // Note moyenne et nombre d'avis
    const ratingsResult = await query(`
      SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews
      FROM reviews
    `);

    // 2. DONNÉES POUR LE GRAPHIQUE DE REVENUS
    let revenueChartData = [];
    
    if (period === '7d') {
      // Données par jour pour les 7 derniers jours
      const dailyRevenueResult = await query(`
        SELECT 
          DAYNAME(booking_time) as day_name,
          DATE(booking_time) as booking_date,
          COALESCE(SUM(price), 0) as revenue,
          COUNT(*) as bookings_count
        FROM bookings
        WHERE ${dateFilter}
        AND status IN ('completed', 'accepted')
        GROUP BY DATE(booking_time), DAYNAME(booking_time)
        ORDER BY booking_date
      `);
      
      // Créer un tableau avec tous les jours de la semaine
      const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const dayMapping = {
        'Monday': 'Lun',
        'Tuesday': 'Mar', 
        'Wednesday': 'Mer',
        'Thursday': 'Jeu',
        'Friday': 'Ven',
        'Saturday': 'Sam',
        'Sunday': 'Dim'
      };
      
      revenueChartData = daysOfWeek.map(day => {
        const dayData = dailyRevenueResult.find(d => dayMapping[d.day_name] === day);
        return {
          name: day,
          value: dayData ? parseFloat(dayData.revenue) : 0,
          bookings: dayData ? dayData.bookings_count : 0
        };
      });
    } else {
      // Données par semaine pour 30d et 90d
      const weeklyRevenueResult = await query(`
        SELECT 
          CONCAT('S', WEEK(booking_time) - WEEK(DATE_SUB(CURDATE(), INTERVAL ${daysCount} DAY)) + 1) as week_name,
          COALESCE(SUM(price), 0) as revenue,
          COUNT(*) as bookings_count
        FROM bookings
        WHERE ${dateFilter}
        AND status IN ('completed', 'accepted')
        GROUP BY WEEK(booking_time)
        ORDER BY WEEK(booking_time)
      `);
      
      revenueChartData = weeklyRevenueResult.map(week => ({
        name: week.week_name,
        value: parseFloat(week.revenue),
        bookings: week.bookings_count
      }));
    }

    // 3. RÉPARTITION DES SERVICES
    const serviceDistributionResult = await query(`
      SELECT 
        service,
        COUNT(*) as service_count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bookings)) as percentage
      FROM bookings
      GROUP BY service
      ORDER BY service_count DESC
    `);
    
    // Couleurs prédéfinies pour les services
    const serviceColors = [
      "#10B981", "#F59E0B", "#EF4444", "#9CA3AF", "#D1D5DB", 
      "#8B5CF6", "#06B6D4", "#F97316", "#84CC16", "#EC4899"
    ];
    
    const serviceDistribution = serviceDistributionResult.map((service, index) => ({
      name: service.service,
      value: Math.round(service.percentage),
      color: serviceColors[index % serviceColors.length]
    }));

    // 4. RÉSERVATIONS RÉCENTES
    const recentBookingsResult = await query(`
      SELECT 
        b.id,
        CONCAT(uc.firstname, ' ', uc.lastname) as client_name,
        b.service as service_name,
        CONCAT(up.firstname, ' ', up.lastname) as professional_name,
        DATE(b.booking_time) as booking_date,
        TIME(b.booking_time) as booking_time,
        b.status,
        b.price,
        b.location as address, -- Contient le JSON des coordonnées
        r.rating
      FROM bookings b
      JOIN users uc ON b.client_id = uc.id
      JOIN users up ON b.professional_id = up.id
      LEFT JOIN reviews r ON b.id = r.booking_id
      ORDER BY b.booking_time DESC
      LIMIT 10
    `);
    
    const recentBookings = recentBookingsResult.map(booking => {
      let latitude = null;
      let longitude = null;
      const locationString = booking.address; // ex: '{"lat":6.258065,"lng":1.226368}'

      try {
        // On parse la chaîne JSON de la colonne 'location'
        const locationData = JSON.parse(locationString);
        if (locationData && typeof locationData.lat === 'number' && typeof locationData.lng === 'number') {
          latitude = locationData.lat;
          longitude = locationData.lng;
        }
      } catch {
        // Si le parsing échoue, on laisse lat/lng à null et on log l'erreur
        console.error(`Impossible de parser les coordonnées JSON pour la réservation ${booking.id}:`, locationString);
      }

      return {
        id: `#SRV${booking.id.toString().padStart(3, '0')}`,
        clientName: booking.client_name,
        serviceName: booking.service_name,
        professionalName: booking.professional_name,
        date: booking.booking_date,
        time: booking.booking_time,
        status: mapBookingStatus(booking.status),
        price: parseFloat(booking.price),
        address: locationString, // On garde la chaîne originale pour le fallback
        latitude: latitude,      // La latitude extraite
        longitude: longitude,    // La longitude extraite
        rating: booking.rating ? parseFloat(booking.rating) : null
      };
    });

    // Calculer les pourcentages de croissance
    const totalBookings = totalBookingsResult[0].total_bookings;
    const previousBookings = previousPeriodBookingsResult[0].previous_bookings;
    const bookingsGrowth = previousBookings > 0 
      ? ((totalBookings - previousBookings) / previousBookings * 100).toFixed(1)
      : 0;

    const activeProfessionals = activeProfessionalsResult[0].active_professionals;
    const previousActiveProfessionals = previousActiveProfessionalsResult[0].previous_active_professionals;
    const professionalsGrowth = previousActiveProfessionals > 0
      ? ((activeProfessionals - previousActiveProfessionals) / previousActiveProfessionals * 100).toFixed(1)
      : 0;

    const currentRevenue = currentMonthRevenueResult[0].current_month_revenue;
    const previousRevenue = previousMonthRevenueResult[0].previous_month_revenue;
    const revenueGrowth = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : 0;

    const averageRating = parseFloat(ratingsResult[0].average_rating).toFixed(1);
    const totalReviews = ratingsResult[0].total_reviews;

    // Construire la réponse
    const dashboardData = {
      stats: {
        totalBookings: {
          value: totalBookings,
          growth: `${bookingsGrowth >= 0 ? '+' : ''}${bookingsGrowth}%`,
          isPositive: bookingsGrowth >= 0
        },
        activeProfessionals: {
          value: activeProfessionals,
          growth: `${professionalsGrowth >= 0 ? '+' : ''}${professionalsGrowth}%`,
          isPositive: professionalsGrowth >= 0
        },
        monthlyRevenue: {
          value: parseFloat(currentRevenue),
          growth: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`,
          isPositive: revenueGrowth >= 0
        },
        averageRating: {
          value: parseFloat(averageRating),
          totalReviews: totalReviews
        }
      },
      revenueChart: revenueChartData,
      serviceDistribution: serviceDistribution,
      recentBookings: recentBookings
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des données du dashboard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des données du dashboard',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour mapper les statuts de réservation
function mapBookingStatus(status) {
  const statusMapping = {
    'pending': 'En attente',
    'accepted': 'Confirmé', 
    'refused': 'Annulé',
    'completed': 'Terminé',
    'cancelled': 'Annulé'
  };
  
  return statusMapping[status] || status;
}
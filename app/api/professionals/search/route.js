import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";

const query = util.promisify(db.query).bind(db);

// Helper function to calculate distance between two points using Haversine formula


;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");
  const latitude = parseFloat(searchParams.get("latitude"));
  const longitude = parseFloat(searchParams.get("longitude"));
  const date = searchParams.get("date"); // format YYYY-MM-DD
  const time = searchParams.get("time"); // format HH:mm

  if (!service || !latitude || !longitude) {
    return NextResponse.json(
      { error: "Missing required search parameters: service, latitude, longitude" },
      { status: 400 }
    );
  }

  try {
    // On veut le nom du service trouvé et la disponibilité réelle
    // Si date et time sont fournis, on filtre sur la disponibilité
    let availabilityJoin = "";
    let availabilityWhere = "";
    let availabilityParams = [];
    if (date && time) {
      // On extrait le jour de la semaine (en anglais, car la table stocke MONDAY, TUESDAY, ...)
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      availabilityJoin = "JOIN availabilities a ON u.id = a.user_id";
      availabilityWhere = "AND a.day_of_week = ? AND a.is_available = 1 AND a.start_time <= ? AND a.end_time > ?";
      availabilityParams = [dayOfWeek, time, time];
    }

    const sqlQuery = `
      SELECT 
        u.id,
        u.firstname,
        u.lastname,
        s.service AS service_name,
        p.bio as description,
        p.address,
        s.prix as min_price,
        l.latitude,
        l.longitude
      FROM users u
      JOIN professionals p ON u.id = p.user_id
      JOIN services s ON u.id = s.professional_id
      LEFT JOIN Location l ON u.id = l.user_id
      ${availabilityJoin}
      WHERE s.service LIKE ? AND u.role = 'professional' ${availabilityWhere}
      GROUP BY u.id, u.firstname, u.lastname, s.service, p.bio, p.address, s.prix, l.latitude, l.longitude
    `;

    let professionals = await query(sqlQuery, [`%${service}%`, ...availabilityParams]);

    // On peut ajouter ici la logique pour calculer le temps estimé si besoin
    const results = professionals.map(p => ({
        ...p,
        avg_rating: 0, // Not in schema
        reviews_count: 0, // Not in schema
        availability: {
            status: "available", // On pourrait raffiner selon la logique métier
            estimated_time: 30 // Placeholder
        }
    }));

    return NextResponse.json(results);

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
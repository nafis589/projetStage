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
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const radius = parseFloat(searchParams.get("radius")) || 10; // Default search radius of 10 km

  if (!service || !latitude || !longitude) {
    return NextResponse.json(
      { error: "Missing required search parameters: service, latitude, longitude" },
      { status: 400 }
    );
  }

  try {
    // For debugging, let's start with the simplest query.
    // We will temporarily ignore availability and location filtering to diagnose the issue.

    const sqlQuery = `
      SELECT 
        u.id,
        u.firstname,
        u.lastname,
        p.profession,
        p.bio as description,
        p.address,
        MIN(s.prix) as min_price,
        l.latitude,
        l.longitude
      FROM users u
      JOIN professionals p ON u.id = p.user_id
      JOIN services s ON u.id = s.professional_id
      LEFT JOIN Location l ON u.id = l.user_id
      WHERE s.service LIKE ? AND u.role = 'professional'
      GROUP BY u.id, u.firstname, u.lastname, p.profession, p.bio, p.address, l.latitude, l.longitude
    `;

    let professionals = await query(sqlQuery, [`%${service}%`]);

    // The original location filter was here. It's temporarily removed for debugging.
    
    // The frontend expects an 'availability' object. We can create a mock one or adjust the frontend.
    // For now, let's add a simple one to avoid breaking the UI.
    const results = professionals.map(p => ({
        ...p,
        avg_rating: 0, // Not in schema
        reviews_count: 0, // Not in schema
        availability: {
            status: "available", // This is not from the DB, just a placeholder
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
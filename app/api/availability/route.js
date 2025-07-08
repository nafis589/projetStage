import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";

// Promisify la méthode de requête SQL
const query = util.promisify(db.query).bind(db);

// POST - Créer ou mettre à jour les disponibilités d'un professionnel
export async function POST(request) {
  try {
    const body = await request.json();
    const { professionalId, availability } = body;

    console.log("Données reçues:", { professionalId, availability });

    if (!professionalId || !availability) {
      return NextResponse.json(
        { error: "Professional ID and availability data are required" },
        { status: 400 }
      );
    }

    // Supprimer les anciennes disponibilités du professionnel
    await query("DELETE FROM availabilities WHERE user_id = ?", [
      professionalId,
    ]);

    // Préparer les données pour l'insertion
    let insertCount = 0;

    for (const [dayName, dayData] of Object.entries(availability)) {
      if (dayData.enabled && dayData.timeSlots.length > 0) {
        for (const timeSlot of dayData.timeSlots) {
          await query(
            "INSERT INTO availabilities (user_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)",
            [
              professionalId,
              dayName.toUpperCase(),
              timeSlot.start,
              timeSlot.end,
              1,
            ]
          );
          insertCount++;
        }
      }
    }

    return NextResponse.json(
      {
        message: "Availability saved successfully",
        count: insertCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Récupérer les disponibilités d'un professionnel
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get("professionalId");

    if (!professionalId) {
      return NextResponse.json(
        { error: "Professional ID is required" },
        { status: 400 }
      );
    }

    const availabilities = await query(
      "SELECT * FROM availabilities WHERE user_id = ? AND is_available = 1 ORDER BY day_of_week, start_time",
      [professionalId]
    );

    // Transformer les données pour correspondre au format du frontend
    const formattedAvailability = {
      monday: { enabled: false, timeSlots: [] },
      tuesday: { enabled: false, timeSlots: [] },
      wednesday: { enabled: false, timeSlots: [] },
      thursday: { enabled: false, timeSlots: [] },
      friday: { enabled: false, timeSlots: [] },
      saturday: { enabled: false, timeSlots: [] },
      sunday: { enabled: false, timeSlots: [] },
    };

    availabilities.forEach((availability) => {
      const dayKey = availability.day_of_week.toLowerCase();
      if (formattedAvailability[dayKey]) {
        formattedAvailability[dayKey].enabled = true;
        formattedAvailability[dayKey].timeSlots.push({
          start: availability.start_time,
          end: availability.end_time,
        });
      }
    });

    return NextResponse.json(formattedAvailability, { status: 200 });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";

const query = util.promisify(db.query).bind(db);

// GET handler to fetch location for a professional
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const results = await query(
      "SELECT id, user_id, adresse as address, latitude, longitude FROM Location WHERE user_id = ?",
      [userId]
    );

    if (results.length === 0) {
      return NextResponse.json(null, { status: 200 }); // Return null if no location is found
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

// POST handler to create or update a location
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, address, latitude, longitude } = data;

    if (!userId || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if a location already exists for this user
    const existingLocation = await query(
      "SELECT id FROM Location WHERE user_id = ?",
      [userId]
    );

    let result;
    if (existingLocation.length > 0) {
      // Update existing location
      result = await query(
        "UPDATE Location SET adresse = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [address, latitude, longitude, userId]
      );
    } else {
      // Insert new location
      result = await query(
        "INSERT INTO Location (user_id, adresse, latitude, longitude) VALUES (?, ?, ?, ?)",
        [userId, address, latitude, longitude]
      );
    }

    return NextResponse.json(
      { message: "Location saved successfully", affectedRows: result.affectedRows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving location:", error);
    return NextResponse.json(
      { error: "Failed to save location" },
      { status: 500 }
    );
  }
}

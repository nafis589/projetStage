import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/util/db";
import util from "util";

const query = util.promisify(db.query).bind(db);

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'client') {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const client_id = session.user.id;
  const { professional_id, service, location, price } = await request.json();

  if (!professional_id || !service || !location || !price) {
    return NextResponse.json({ error: "Données de réservation manquantes" }, { status: 400 });
  }

  try {
    const result = await query(
      "INSERT INTO bookings (client_id, professional_id, service, location, price, status) VALUES (?, ?, ?, ?, ?, ?)",
      [client_id, professional_id, service, location, price, 'pending']
    );

    const bookingId = result.insertId;

    const newBooking = await query("SELECT * FROM bookings WHERE id = ?", [bookingId]);

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET(request) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view'); // 'client' or 'professional'
  
    try {
        let bookings;
        if (view === 'professional') {
            bookings = await query(
            `SELECT b.*, u.firstname as client_firstname, u.lastname as client_lastname 
             FROM bookings b
             JOIN users u ON b.client_id = u.id
             WHERE b.professional_id = ? 
             ORDER BY b.booking_time DESC`,
            [userId]
          );
        } else { // Default to client view
            bookings = await query(
            `SELECT b.*, u.firstname as prof_firstname, u.lastname as prof_lastname 
             FROM bookings b
             JOIN users u ON b.professional_id = u.id
             WHERE b.client_id = ? 
             ORDER BY b.booking_time DESC`,
            [userId]
          );
        }
  
      return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
} 
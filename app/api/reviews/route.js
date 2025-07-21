import { NextResponse } from "next/server";
import db from "@/util/db";
import util from "util";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const query = util.promisify(db.query).bind(db);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { booking_id, professional_id, rating, comment } = await request.json();
  const client_id = session.user.id;
  // Vérifier unicité
  const existing = await query("SELECT id FROM reviews WHERE booking_id = ?", [booking_id]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Avis déjà laissé" }, { status: 400 });
  }
  await query(
    "INSERT INTO reviews (booking_id, client_id, professional_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [booking_id, client_id, professional_id, rating, comment]
  );
  return NextResponse.json({ success: true });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const booking_id = searchParams.get("booking_id");
  if (!booking_id) return NextResponse.json({ error: "booking_id requis" }, { status: 400 });
  const reviews = await query("SELECT * FROM reviews WHERE booking_id = ?", [booking_id]);
  if (reviews.length === 0) return NextResponse.json(null);
  return NextResponse.json(reviews[0]);
} 
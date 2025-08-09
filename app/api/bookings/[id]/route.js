import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/util/db";
import util from "util";

const query = util.promisify(db.query).bind(db);

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  const { status } = await request.json();

  if (!session || !session.user || session.user.role !== 'professional') {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!status || !['accepted', 'cancelled', 'completed'].includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  try {
    const [booking] = await query("SELECT professional_id FROM bookings WHERE id = ?", [id]);
    if (!booking || booking.professional_id !== session.user.id) {
        return NextResponse.json({ error: "Réservation non trouvée ou non autorisée" }, { status: 404 });
    }

    await query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);

    const [updatedBooking] = await query("SELECT * FROM bookings WHERE id = ?", [id]);

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  const { status } = await request.json();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (status !== 'cancelled') {
    return NextResponse.json({ error: "Action non autorisée. Seule l'annulation est permise." }, { status: 400 });
  }

  try {
    const [booking] = await query("SELECT client_id FROM bookings WHERE id = ?", [id]);

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée." }, { status: 404 });
    }

    if (booking.client_id !== session.user.id) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à modifier cette réservation." }, { status: 403 });
    }

    await query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);

    return NextResponse.json({ message: "Réservation annulée avec succès." }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
} 
import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const query = util.promisify(db.query).bind(db);

export const POST = async (req) => {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer et valider les données
    const { professionalId, slots } = await req.json();
    
    if (!professionalId || !slots || !Array.isArray(slots)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Vérifier que l'utilisateur est bien le propriétaire du profil professionnel
    const professional = await query(
      'SELECT id FROM professionals WHERE user_id = ? AND id = ?',
      [session.user.id, professionalId]
    );

    if (!professional || professional.length === 0) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Supprimer les anciennes disponibilités
    await query(
      'DELETE FROM availabilities WHERE professional_id = ?',
      [professionalId]
    );

    // Insérer les nouvelles disponibilités
    for (const slot of slots) {
      await query(
        'INSERT INTO availabilities (professional_id, day_of_week, time) VALUES (?, ?, ?)',
        [professionalId, slot.day, slot.hour]
      );
    }
    
    return NextResponse.json({ message: "Disponibilités enregistrées avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Erreur API availability :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
};

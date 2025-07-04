// app/api/professional/[id]/route.ts

import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";

// Promisify la méthode de requête SQL
const query = util.promisify(db.query).bind(db);

export const PUT = async (req, context) => {
  const { id: professionalId } = context.params;
  const body = await req.json();
  console.log("ID reçu :", professionalId);
  console.log("Corps reçu :", body);

  try {
    const { firstname, lastname, email, bio, phone, address, city, services } =
      body;

    // Sécurité minimale : s’assurer que les champs requis sont présents
    if (!firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Mettre à jour la table users
    await query(
      `
      UPDATE users 
      SET firstname = '${firstname}', lastname = '${lastname}', email = '${email}'
      WHERE id = '${professionalId}'
      `
    );

    // Mettre à jour la table professionals
    await query(`
    UPDATE professionals 
    SET bio = '${bio}', 
        phone = '${phone}', 
        address = '${address}', 
        city = '${city}', 
        profession = '${services}'
    WHERE user_id = '${professionalId}'
`);

    return NextResponse.json(
      { message: "Profil mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur complète :",
      error instanceof Error ? error.stack : error
    );

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};

import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";
import bcrypt from "bcrypt";

const query = util.promisify(db.query).bind(db);

export const POST = async (req) => {
  const user = await req.json();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 8);
    const results = await query(
      `INSERT INTO users (firstname, lastname, email, password, role) VALUES ('${user.firstname}', '${user.lastname}', '${user.email}', '${hashedPassword}', 'client')`
    );
    const userId= results.insertId;
    await query(
      `INSERT INTO clients (user_id) VALUES (?)`,
      [userId]
    );

    return NextResponse.json({ message: "Utilisateur inscrit avec succès" }, { status: 201 });

    if (results)
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
  } catch (error) {
    console.error("Erreur API register :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
};

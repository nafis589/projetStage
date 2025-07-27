import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Promisify the db.query method
const query = util.promisify(db.query).bind(db);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = session.user.id;

  try {
    const clientData = await query(
      `
      SELECT u.firstname, u.lastname, u.email, c.address, c.city
      FROM users u
      LEFT JOIN clients c ON u.id = c.user_id
      WHERE u.id = ?
      `,
      [clientId]
    );

    if (clientData.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(clientData[0]);
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch client profile" },
      { status: 500 }
    );
  }
}

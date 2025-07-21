import { NextResponse } from "next/server";
import util from "util";
import db from "@/util/db";

const query = util.promisify(db.query).bind(db);

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Data reçu dans API POST /service/[id]:", data);
    const { name, price, description, professionalId } = data;

    if (!name || !price || !description || !professionalId) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Note: The database schema uses `service` for the name and `prix` for the price.
    const result = await query(
      "INSERT INTO services (service, prix, description, professional_id) VALUES (?, ?, ?, ?)",
      [name, price, description, professionalId]
    );

    const newService = {
      id: result.insertId,
      name: name,
      price: price,
      description: description,
    };

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const professionalId = params.id;

    // Use aliases to match the frontend's expected field names (`name`, `price`)
    const services = await query(
      "SELECT id, service AS name, prix AS price, description FROM services WHERE professional_id = ?",
      [professionalId]
    );

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const serviceId = params.id;
    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID manquant" },
        { status: 400 }
      );
    }
    await query("DELETE FROM services WHERE id = ?", [serviceId]);
    return NextResponse.json({ message: "Service supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression du service:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du service" },
      { status: 500 }
    );
  }
}

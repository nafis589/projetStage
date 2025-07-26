import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import util from 'util';
import db from '@/util/db';

const query = util.promisify(db.query).bind(db);

// GET - Récupérer les informations de l'admin connecté
export async function GET(request) {
  try {
    // Récupérer le token JWT pour identifier l'utilisateur connecté
    const token = await getToken({ req: request });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 401 }
      );
    }
    
    // Récupérer les informations de l'admin depuis la base de données
    const adminQuery = `
      SELECT 
        id,
        firstname,
        lastname,
        email,
        role,
        created_at
      FROM users 
      WHERE id = ? AND role = 'admin'
    `;
    
    const adminResult = await query(adminQuery, [token.sub]);
    
    if (adminResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Admin non trouvé' },
        { status: 404 }
      );
    }
    
    const admin = adminResult[0];
    
    return NextResponse.json({
      success: true,
      data: {
        id: admin.id.toString(),
        firstName: admin.firstname,
        lastName: admin.lastname,
        email: admin.email,
        role: admin.role,
        registrationDate: admin.created_at
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération du profil admin:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération du profil admin',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
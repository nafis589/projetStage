import { NextResponse } from 'next/server';
import util from 'util';
import db from '@/util/db';

const query = util.promisify(db.query).bind(db);

// GET - Récupérer tous les utilisateurs
export async function GET(request) {
  try {
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || 'all';
    
    const offset = (page - 1) * limit;
    
    // Construction de la requête avec filtres
    let whereClause = 'WHERE 1=1';
    let queryParams = [];
    
    // Filtre de recherche
    if (search) {
      whereClause += ' AND (firstname LIKE ? OR lastname LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Filtre par rôle
    if (roleFilter !== 'all') {
      whereClause += ' AND role = ?';
      // Convertir 'professionnel' en 'professional' pour la requête DB
      const dbRole = roleFilter === 'professionnel' ? 'professional' : roleFilter;
      queryParams.push(dbRole);
    }
    
    // Requête pour récupérer les utilisateurs avec pagination
    const usersQuery = `
      SELECT 
        id,
        firstname,
        lastname,
        email,
        role,
        created_at,
        COALESCE(status, 'inactif') as status
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(limit, offset);
    
    const users = await query(usersQuery, queryParams);
    
    // Requête pour compter le total d'utilisateurs (pour la pagination)
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM users 
      ${whereClause}
    `;
    
    const countParams = queryParams.slice(0, -2); // Enlever limit et offset
    const countResult = await query(countQuery, countParams);
    const total = countResult[0].total;
    
    // Statistiques
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN COALESCE(status, 'inactif') = 'actif' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN COALESCE(status, 'inactif') = 'inactif' THEN 1 ELSE 0 END) as inactive_users
      FROM users
    `);
    
    const stats = statsResult[0];
    
    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id.toString(),
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          role: user.role === 'professional' ? 'professionnel' : user.role,
          registrationDate: user.created_at.toISOString().split('T')[0],
          status: user.status
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          limit
        },
        stats: {
          total: stats.total_users,
          active: stats.active_users,
          inactive: stats.inactive_users
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des utilisateurs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un utilisateur (changer le rôle ou le statut)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, action, newRole, newStatus } = body;
    
    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'ID utilisateur et action requis' },
        { status: 400 }
      );
    }
    
    if (action === 'changeRole' && newRole) {
      // Convertir 'professionnel' en 'professional' pour la base de données
      const dbRole = newRole === 'professionnel' ? 'professional' : newRole;
      
      // Mettre à jour le rôle de l'utilisateur
      await query(
        'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [dbRole, userId]
      );
      
      // Si le nouveau rôle est 'client', s'assurer qu'il y a une entrée dans la table clients
      if (dbRole === 'client') {
        await query(
          'INSERT IGNORE INTO clients (user_id) VALUES (?)',
          [userId]
        );
        // Supprimer de professionals si il y était
        await query(
          'DELETE FROM professionals WHERE user_id = ?',
          [userId]
        );
      }
      
      // Si le nouveau rôle est 'professional', s'assurer qu'il y a une entrée dans la table professionals
      if (dbRole === 'professional') {
        await query(
          'INSERT IGNORE INTO professionals (user_id) VALUES (?)',
          [userId]
        );
        // Supprimer de clients si il y était
        await query(
          'DELETE FROM clients WHERE user_id = ?',
          [userId]
        );
      }
      
      // Si le nouveau rôle est 'admin', supprimer des deux tables
      if (dbRole === 'admin') {
        await query(
          'DELETE FROM clients WHERE user_id = ?',
          [userId]
        );
        await query(
          'DELETE FROM professionals WHERE user_id = ?',
          [userId]
        );
      }
    }
    
    if (action === 'toggleStatus') {
      // Mettre à jour directement le statut dans la table users
      await query(
        'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newStatus, userId]
      );
      
      // Optionnel: Gérer aussi les tables clients/professionals selon le statut
      const userResult = await query(
        'SELECT role FROM users WHERE id = ?',
        [userId]
      );
      
      if (userResult.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const userRole = userResult[0].role;
      
      if (newStatus === 'actif') {
        // Activer l'utilisateur en l'ajoutant à la table appropriée
        if (userRole === 'client') {
          await query(
            'INSERT IGNORE INTO clients (user_id) VALUES (?)',
            [userId]
          );
        } else if (userRole === 'professional') {
          await query(
            'INSERT IGNORE INTO professionals (user_id) VALUES (?)',
            [userId]
          );
        }
      } else {
        // Désactiver l'utilisateur en le supprimant de la table appropriée
        if (userRole === 'client') {
          await query(
            'DELETE FROM clients WHERE user_id = ?',
            [userId]
          );
        } else if (userRole === 'professional') {
          await query(
            'DELETE FROM professionals WHERE user_id = ?',
            [userId]
          );
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la mise à jour de l\'utilisateur',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }
    
    // Vérifier si l'utilisateur existe
    const userCheck = await query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    
    if (userCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer l'utilisateur (CASCADE supprimera automatiquement les entrées liées)
    await query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la suppression de l\'utilisateur',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
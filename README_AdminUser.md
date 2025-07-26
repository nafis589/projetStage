# Système de Gestion des Utilisateurs - Admin Dashboard

## Configuration

### 1. Base de données

Avant d'utiliser le système, vous devez configurer votre base de données MySQL :

1. **Créer la base de données** en exécutant le script SQL fourni
2. **Ajouter la colonne status** si elle n'existe pas déjà :
   ```sql
   ALTER TABLE users 
   ADD COLUMN IF NOT EXISTS status ENUM('actif', 'inactif') DEFAULT 'actif' 
   AFTER role;
   ```

### 2. Variables d'environnement

Le projet utilise déjà la configuration de base de données existante dans `util/db.ts`. Assurez-vous que votre fichier `.env.local` contient :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=geservice
DB_PORT=3306
```

### 3. Dépendances

Le projet utilise la configuration de base de données existante avec `mysql2` et `util.promisify` pour une approche cohérente avec les autres routes API.

## Fonctionnalités

### API Endpoints

#### GET `/api/AdminUser`
Récupère la liste des utilisateurs avec pagination et filtres.

**Paramètres de requête :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `search` : Terme de recherche (nom, prénom, email)
- `role` : Filtre par rôle (all, client, professionnel, admin)

**Réponse :**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "limit": 10
    },
    "stats": {
      "total": 50,
      "active": 35,
      "inactive": 15
    }
  }
}
```

#### PUT `/api/AdminUser`
Met à jour un utilisateur (changement de rôle ou de statut).

**Corps de la requête :**
```json
{
  "userId": "123",
  "action": "changeRole", // ou "toggleStatus"
  "newRole": "client", // pour changeRole
  "newStatus": "actif" // pour toggleStatus
}
```

#### DELETE `/api/AdminUser?userId=123`
Supprime un utilisateur de la base de données.

### Interface utilisateur

Le composant `AdminUser.tsx` fournit une interface complète pour :

1. **Visualiser les utilisateurs** avec pagination
2. **Rechercher** par nom, prénom ou email
3. **Filtrer** par rôle
4. **Changer le statut** (actif/inactif) d'un utilisateur
5. **Modifier le rôle** d'un utilisateur
6. **Supprimer** un utilisateur avec confirmation
7. **Voir les statistiques** en temps réel

### Logique métier

#### Gestion des statuts
- **Actif** : L'utilisateur peut utiliser la plateforme
- **Inactif** : L'utilisateur est désactivé

#### Gestion des rôles
- **Client** : Utilisateur qui demande des services
- **Professionnel** : Utilisateur qui fournit des services
- **Admin** : Administrateur de la plateforme

#### Cohérence des données
- Quand un utilisateur change de rôle, il est automatiquement ajouté/supprimé des tables `clients` ou `professionals`
- Le statut est géré à la fois dans la table `users` et par la présence dans les tables spécialisées
- La suppression d'un utilisateur supprime automatiquement toutes ses données liées (CASCADE)

## Structure des fichiers

```
app/
├── api/
│   └── AdminUser/
│       └── route.js          # API endpoints pour la gestion des utilisateurs
├── components/
│   └── AdminUser.tsx         # Interface utilisateur
└── dashboard/
    └── admin/
        └── page.tsx          # Dashboard admin avec onglets

database/
└── migration.sql             # Script de migration pour ajouter la colonne status

.env.example                  # Exemple de configuration
```

## Sécurité

- Validation des paramètres d'entrée
- Transactions pour maintenir la cohérence des données
- Gestion des erreurs avec rollback automatique
- Vérification de l'existence des utilisateurs avant modification/suppression

## Utilisation

1. Accédez au dashboard admin
2. Cliquez sur l'onglet "Utilisateurs"
3. Utilisez les filtres et la recherche pour trouver des utilisateurs
4. Utilisez les actions pour gérer les utilisateurs :
   - Cliquez sur l'icône vert/rouge pour activer/désactiver
   - Changez le rôle via le sélecteur
   - Cliquez sur l'icône poubelle pour supprimer (avec confirmation)

## Dépannage

### Erreurs de connexion à la base de données
- Vérifiez vos variables d'environnement dans `.env.local`
- Assurez-vous que MySQL est démarré
- Vérifiez les permissions de l'utilisateur de base de données

### Erreurs de migration
- Exécutez le script `database/migration.sql` manuellement
- Vérifiez que la colonne `status` existe dans la table `users`

### Problèmes de performance
- Ajoutez des index sur les colonnes fréquemment recherchées
- Optimisez les requêtes si nécessaire
- Considérez la mise en cache pour les grandes bases de données
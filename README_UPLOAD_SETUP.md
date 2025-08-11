# Configuration du système d'upload de documents

## 1. Mise à jour de la base de données

Avant d'utiliser le système d'upload, vous devez ajouter la table `professional_documents` à votre base de données.

### Exécuter le script SQL

```sql
-- Connectez-vous à votre base de données MySQL et exécutez :
source sql/add_documents_table.sql;

-- Ou copiez-collez directement le contenu :
USE geservice;

CREATE TABLE professional_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    document_type ENUM('cv', 'certification', 'identity', 'other') DEFAULT 'other',
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_documents (user_id)
);
```

## 2. Stockage des fichiers (Vercel Blob)

En production sur Vercel, l'écriture sur le disque (`public/uploads`) n'est pas persistante. Le projet est désormais migré vers **Vercel Blob** pour stocker les fichiers de manière durable.

### Variables d'environnement requises

Ajoutez dans vos variables d'environnement (
`Vercel Project Settings > Environment Variables` ou `.env.local` en dev) :

```
BLOB_READ_WRITE_TOKEN=...   # Token généré depuis le dashboard Vercel Blob
NEXTAUTH_SECRET=...         # Déjà présent pour NextAuth
```

Référez-vous à la documentation Vercel Blob pour créer un token avec accès lecture/écriture.

### Comportement

- À l'upload, les fichiers sont envoyés vers Vercel Blob avec un accès public.
- L'URL publique retournée est enregistrée en base (`professional_documents.file_path`).
- La suppression supprime le blob distant via l'API Blob.

## 3. Fonctionnalités implémentées

### API Routes
- **POST** `/api/upload/documents` - Upload de fichiers
- **GET** `/api/upload/documents` - Récupération des documents d'un utilisateur
- **DELETE** `/api/upload/documents?id=X` - Suppression d'un document

### Composants
- `FileUploadWithAPI.tsx` - Composant d'upload avec gestion API complète
- `ProfessionelForm.tsx` - Formulaire d'inscription en 2 étapes

### Sécurité
- Authentification requise (NextAuth JWT)
- Validation des types de fichiers
- Limitation de taille (5MB par fichier)
- Noms de fichiers uniques pour éviter les conflits
- Vérification de propriété pour la suppression

### Types de fichiers acceptés
- PDF (.pdf)
- Documents Word (.doc, .docx)
- Images (.jpg, .jpeg, .png)

### Classification automatique
Le système classe automatiquement les documents selon leur nom :
- **CV** : fichiers contenant "cv" ou "resume"
- **Certification** : fichiers contenant "cert" ou "diplom"
- **Identité** : fichiers contenant "id", "carte" ou "passeport"
- **Autre** : tous les autres fichiers

## 4. Flux d'inscription professionnel

1. **Étape 1** : Saisie des informations personnelles
   - Création du compte utilisateur
   - Validation des données

2. **Étape 2** : Upload des documents
   - Interface drag & drop
   - Upload en temps réel vers l'API
   - Sauvegarde en base de données

3. **Étape 3** : Connexion automatique
   - Authentification avec NextAuth
   - Redirection vers le dashboard professionnel

## 5. Gestion des erreurs

- Validation côté client et serveur
- Messages d'erreur explicites
- Possibilité de réessayer l'upload
- Nettoyage automatique en cas d'échec

## 6. Permissions et accès

- Seuls les utilisateurs authentifiés peuvent uploader
- Chaque utilisateur ne peut voir que ses propres documents
- Les administrateurs peuvent accéder à tous les documents (à implémenter)

## 7. Maintenance

### Nettoyage des fichiers orphelins
Vous pouvez créer un script de maintenance pour supprimer les fichiers qui ne sont plus référencés en base :

```javascript
// scripts/cleanup-orphaned-files.js
// À implémenter selon vos besoins
```

### Sauvegarde
Les fichiers étant stockés sur Vercel Blob, il n'est plus nécessaire de sauvegarder `public/uploads/`. Assurez-vous de sauvegarder la base de données qui contient les URL de fichiers.
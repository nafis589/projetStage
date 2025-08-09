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

## 2. Structure des dossiers

Le système créera automatiquement la structure suivante :

```
public/
└── uploads/
    └── documents/
        ├── .gitkeep
        └── [fichiers uploadés]
```

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
N'oubliez pas d'inclure le dossier `public/uploads/` dans vos sauvegardes régulières.
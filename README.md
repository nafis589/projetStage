# 🏠 **GESERVICE** 
### *Plateforme de Services à Domicile Nouvelle Génération*

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

*Simplifiez la gestion de vos services à domicile avec une plateforme moderne et intuitive*

[🚀 Démo Live](#) • [📖 Documentation](#) • [🐛 Signaler un Bug](#) • [💡 Demander une Fonctionnalité](#)

</div>

---

## 🌟 **Vue d'Ensemble**

**Geservice** est une plateforme web complète qui révolutionne la façon dont les clients trouvent et réservent des services à domicile. Conçue avec les dernières technologies web, elle offre une expérience utilisateur exceptionnelle pour trois types d'utilisateurs distincts : **clients**, **professionnels** et **administrateurs**.

### 🎯 **Mission**
Connecter efficacement les clients avec des professionnels qualifiés pour tous types de services à domicile, tout en fournissant des outils de gestion avancés pour optimiser les opérations.

---

## ✨ **Fonctionnalités Principales**

### 👥 **Pour les Clients**
- 🔍 **Recherche Intelligente** : Trouvez rapidement des professionnels par service et localisation
- 📅 **Réservation Simplifiée** : Interface intuitive avec sélection de date/heure
- 🗺️ **Géolocalisation Avancée** : Intégration MapLibre pour la localisation précise
- ⭐ **Système d'Évaluation** : Notez et commentez vos expériences
- 📊 **Tableau de Bord Personnel** : Suivez vos réservations et historique

### 🔧 **Pour les Professionnels**
- 📋 **Gestion des Disponibilités** : Définissez vos créneaux de travail
- 💼 **Portefeuille de Services** : Gérez votre catalogue de prestations
- 📈 **Statistiques Détaillées** : Analysez vos performances
- 💬 **Communication Client** : Interface de messagerie intégrée
- 💰 **Suivi des Revenus** : Tableaux de bord financiers

### 👨‍💼 **Pour les Administrateurs**
- 🎛️ **Dashboard Complet** : Vue d'ensemble en temps réel
- 📊 **Analytics Avancés** : Graphiques et métriques détaillées
- 👤 **Gestion Utilisateurs** : Administration complète des comptes
- 🔄 **Gestion des Réservations** : Supervision et modération
- 📍 **Cartographie Interactive** : Visualisation géographique des services

---

## 🛠️ **Stack Technique**

### **Frontend**
```
🎨 Next.js 15.3.4        - Framework React full-stack
📘 TypeScript 5.0        - Typage statique
🎯 Tailwind CSS 4.0      - Framework CSS utilitaire
🧩 Radix UI              - Composants accessibles
🎪 Lucide React          - Icônes modernes
📊 Recharts              - Graphiques et visualisations
```

### **Backend & Base de Données**
```
🔐 NextAuth.js 4.24      - Authentification sécurisée
🗄️ MySQL 2              - Base de données relationnelle
🔒 bcrypt 6.0            - Hachage des mots de passe
🌐 MapLibre GL 5.6       - Cartographie interactive
```

### **État & Validation**
```
🏪 Zustand 5.0           - Gestion d'état légère
📝 React Hook Form 7.60  - Gestion des formulaires
✅ Zod 4.0               - Validation de schémas
🔧 Class Variance Authority - Gestion des variantes CSS
```

### **Outils de Développement**
```
🔍 ESLint 9.0            - Linting du code
🎯 PostCSS 4.0           - Traitement CSS
📦 Node.js 20+           - Environnement d'exécution
```

---

## 🏗️ **Architecture du Projet**

```
service-domicile/
├── 📁 app/                    # App Router Next.js
│   ├── 🔐 (auth)/            # Routes d'authentification
│   │   ├── login/             # Page de connexion
│   │   └── register/          # Page d'inscription
│   ├── 🌐 api/               # Routes API
│   │   ├── auth/              # Authentification
│   │   ├── bookings/          # Gestion des réservations
│   │   ├── professionals/     # Gestion des professionnels
│   │   ├── dashboard/         # Données du tableau de bord
│   │   └── reviews/           # Système d'avis
│   ├── 📊 dashboard/         # Tableaux de bord
│   │   ├── admin/             # Interface administrateur
│   │   ├── client/            # Interface client
│   │   └── professional/      # Interface professionnel
│   └── 🧩 components/        # Composants de page
├── 🎨 components/            # Composants réutilisables
│   ├── ui/                    # Composants UI de base
│   ├── header/                # En-tête de navigation
│   ├���─ footer/                # Pied de page
│   └── dashboardTab/          # Onglets du tableau de bord
├── 🪝 hooks/                 # Hooks React personnalisés
├── 📚 lib/                   # Utilitaires et configurations
├── 🔧 util/                  # Fonctions utilitaires
├── 🎯 types/                 # Définitions TypeScript
└── 🌍 public/               # Assets statiques
```

---

## 🚀 **Installation & Configuration**

### **Prérequis**
- Node.js 20+ 
- MySQL 8.0+
- npm ou yarn

### **1. Clonage du Projet**
```bash
git clone https://github.com/votre-repo/service-domicile.git
cd service-domicile
```

### **2. Installation des Dépendances**
```bash
npm install
# ou
yarn install
```

### **3. Configuration de l'Environnement**
Créez un fichier `.env.local` à la racine :

```env
# Base de données
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=geservice_db

# NextAuth
NEXTAUTH_SECRET=votre_secret_super_securise
NEXTAUTH_URL=http://localhost:3000

# Optionnel : Clés API pour services externes
MAPLIBRE_API_KEY=votre_cle_maplibre
```

### **4. Configuration de la Base de Données**
```sql
-- Créer la base de données
CREATE DATABASE geservice_db;

-- Utiliser la base de données
USE geservice_db;

-- Les tables seront créées automatiquement au premier lancement
```

### **5. Lancement du Projet**
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

🌐 **Accédez à l'application** : [http://localhost:3000](http://localhost:3000)

---

## 📱 **Interfaces Utilisateur**

### **🏠 Page d'Accueil**
- Hero section avec formulaire de recherche
- Suggestions de services populaires
- Section d'activités récentes
- Footer informatif

### **🔐 Authentification**
- Connexion sécurisée avec NextAuth
- Inscription différenciée (client/professionnel)
- Gestion des sessions
- Protection des routes

### **📊 Tableaux de Bord**

#### **Client Dashboard**
- Vue d'ensemble des réservations
- Historique des services
- Gestion du profil
- Système d'évaluation

#### **Professionnel Dashboard**
- Calendrier des disponibilités
- Gestion des services offerts
- Statistiques de performance
- Communication client

#### **Admin Dashboard**
- Métriques en temps réel
- Graphiques de revenus
- Gestion des utilisateurs
- Supervision des réservations
- Cartographie des services

---

## 🔧 **API Endpoints**

### **Authentification**
```
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
POST /api/auth/professionel # Inscription professionnel
```

### **Gestion des Utilisateurs**
```
GET  /api/clientProfil      # Profil client
GET  /api/admin-profile     # Profil administrateur
POST /api/AdminUser         # Gestion utilisateurs admin
```

### **Services & Réservations**
```
GET  /api/professionals     # Liste des professionnels
GET  /api/service/:id       # Détails d'un service
POST /api/bookings          # Créer une réservation
PUT  /api/bookings/:id      # Modifier une réservation
```

### **Analytics & Dashboard**
```
GET  /api/dashboard         # Données du tableau de bord
GET  /api/dashboardResume   # Résumé des métriques
GET  /api/reviews           # Système d'avis
```

---

## 🎨 **Design System**

### **Palette de Couleurs**
- **Primaire** : Noir (#000000) - Élégance et modernité
- **Secondaire** : Gris (#6B7280) - Subtilité et équilibre
- **Accent** : Bleu (#3B82F6) - Confiance et professionnalisme
- **Succès** : Vert (#10B981) - Validation et réussite
- **Attention** : Jaune (#F59E0B) - Alertes et notifications
- **Erreur** : Rouge (#EF4444) - Erreurs et suppressions

### **Typographie**
- **Principale** : Geist Sans - Lisibilité optimale
- **Monospace** : Geist Mono - Code et données

### **Composants UI**
- Boutons avec états hover/focus
- Formulaires avec validation en temps réel
- Modales et popups accessibles
- Cartes avec ombres subtiles
- Navigation responsive

---

## 🔒 **Sécurité**

### **Authentification**
- Hachage bcrypt pour les mots de passe
- Sessions JWT sécurisées
- Protection CSRF intégrée
- Validation côté serveur

### **Autorisation**
- Middleware de protection des routes
- Rôles utilisateur (client/professionnel/admin)
- Vérification des permissions
- Isolation des données

### **Base de Données**
- Requêtes préparées (protection SQL injection)
- Validation des entrées avec Zod
- Chiffrement des données sensibles

---

## 📊 **Métriques & Analytics**

### **KPIs Suivis**
- 📈 Nombre total de réservations
- 👥 Professionnels actifs
- 💰 Revenus mensuels
- ⭐ Note moyenne des services
- 📍 Répartition géographique
- 🔄 Taux de conversion

### **Visualisations**
- Graphiques de revenus (Recharts)
- Diagrammes circulaires des services
- Cartes de chaleur géographiques
- Tableaux de données interactifs

---

## 🌍 **Géolocalisation**

### **Fonctionnalités Cartographiques**
- Intégration MapLibre GL JS
- Localisation automatique
- Marqueurs personnalisés
- Calcul de distances
- Zones de service
- Navigation intégrée

---

## 🚀 **Déploiement**

### **Environnements**
```bash
# Développement
npm run dev

# Test
npm run build
npm run start

# Production
npm run build
# Déployer sur Vercel, Netlify, ou serveur personnalisé
```

### **Variables d'Environnement de Production**
```env
NODE_ENV=production
DB_HOST=votre_serveur_prod
NEXTAUTH_URL=https://votre-domaine.com
# Autres variables sécurisées...
```

---

## 🤝 **Contribution**

### **Comment Contribuer**
1. 🍴 Fork le projet
2. 🌿 Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push vers la branche (`git push origin feature/AmazingFeature`)
5. 🔄 Ouvrez une Pull Request

### **Standards de Code**
- Utiliser TypeScript pour le typage
- Suivre les conventions ESLint
- Commenter le code complexe
- Tester les nouvelles fonctionnalités
- Respecter l'architecture existante

---

## 📝 **Roadmap**

### **Version 0.2.0** (À venir)
- [ ] 💬 Système de messagerie en temps réel
- [ ] 📱 Application mobile (React Native)
- [ ] 🔔 Notifications push
- [ ] 💳 Intégration paiement en ligne
- [ ] 🌐 Support multilingue

### **Version 0.3.0** (Futur)
- [ ] 🤖 IA pour recommandations
- [ ] 📊 Analytics avancés
- [ ] 🔗 API publique
- [ ] 🎯 Programme de fidélité
- [ ] 📈 Outils marketing

---

## 📞 **Support & Contact**

### **Équipe de Développement**
- **Lead Developer** : [Votre Nom]
- **Email** : support@geservice.com
- **Documentation** : [docs.geservice.com]

### **Liens Utiles**
- 🐛 [Signaler un Bug](https://github.com/votre-repo/issues)
- 💡 [Demander une Fonctionnalité](https://github.com/votre-repo/issues/new)
- 📖 [Documentation Complète](#)
- 💬 [Discord Communauté](#)

---

## 📄 **Licence**

Ce projet est sous licence privée. Tous droits réservés.

```
Copyright (c) 2024 Geservice
Tous droits réservés.
```

---

<div align="center">

### 🌟 **Merci d'utiliser Geservice !**

*Développé avec ❤️ par l'équipe Geservice*

[⬆️ Retour en haut](#-geservice)

</div>
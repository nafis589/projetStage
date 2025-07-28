<div align="center">

# 🏠 **GESERVICE**
### *Plateforme de Services à Domicile Nouvelle Génération*

</div>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.mysql.com/" target="_blank"><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"></a>
  <a href="https://next-auth.js.org/" target="_blank"><img src="https://img.shields.io/badge/NextAuth.js-000?style=for-the-badge&logo=next-auth&logoColor=white" alt="NextAuth.js"></a>
</p>

<p align="center">
  <i>Simplifiez la gestion de vos services à domicile avec une plateforme moderne, performante et intuitive.</i>
</p>

<p align="center">
  <a href="#">🚀 Démo Live</a> •
  <a href="#-architecture-du-projet">📖 Documentation</a> •
  <a href="#">🐛 Signaler un Bug</a> •
  <a href="#">💡 Demander une Fonctionnalité</a>
</p>

---

## 🌟 **Vue d'Ensemble**

**Geservice** est une application web complète qui révolutionne la mise en relation entre clients et professionnels pour les services à domicile. Conçue avec les technologies les plus récentes, elle offre une expérience utilisateur fluide et optimisée pour trois rôles distincts : **clients**, **professionnels**, et **administrateurs**.

### 🎯 **Mission**
Notre mission est de connecter efficacement les clients avec des prestataires qualifiés, tout en fournissant des outils de gestion avancés pour simplifier et optimiser l'ensemble du processus de réservation et de suivi.

---

## ✨ **Fonctionnalités Clés**

| Pour les Clients | Pour les Professionnels | Pour les Administrateurs |
| :--- | :--- | :--- |
| 🔍 Recherche intelligente | 📋 Gestion des disponibilités | 🎛️ Dashboard global |
| 📅 Réservation simplifiée | 💼 Portefeuille de services | 📊 Analytics avancés |
| 🗺️ Géolocalisation précise | 📈 Statistiques de performance | 👤 Gestion des utilisateurs |
| ⭐ Système d'évaluation | 💬 Communication client | 🔄 Supervision des réservations |
| 📊 Tableau de bord personnel | 💰 Suivi des revenus | 📍 Cartographie interactive |

---

## 🛠️ **Stack Technique**

| Catégorie | Technologie | Description |
| :--- | :--- | :--- |
| **Frontend** | <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" height="20"> | Framework React pour le SSR et le SSG. |
| | <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" height="20"> | Bibliothèque pour la construction d'interfaces utilisateur. |
| | <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" height="20"> | Framework CSS pour un design rapide et moderne. |
| **Backend** | <img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" height="20"> | Environnement d'exécution JavaScript côté serveur. |
| | <img src="https://img.shields.io/badge/NextAuth.js-000?style=flat&logo=next-auth&logoColor=white" alt="NextAuth.js" height="20"> | Solution d'authentification complète pour Next.js. |
| **Base de Données** | <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" alt="MySQL" height="20"> | Système de gestion de base de données relationnelle. |
| **Langage** | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" height="20"> | Superset de JavaScript pour un code plus robuste. |
| **UI & Composants** | <img src="https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white" alt="Radix UI" height="20"> | Composants d'interface utilisateur accessibles. |
| | <img src="https://img.shields.io/badge/Lucide-5A67D8?style=flat&logo=lucide&logoColor=white" alt="Lucide React" height="20"> | Bibliothèque d'icônes légères et personnalisables. |
| **Gestion d'État** | <img src="https://img.shields.io/badge/Zustand-000?style=flat" alt="Zustand" height="20"> | Gestionnaire d'état minimaliste pour React. |
| **Cartographie** | <img src="https://img.shields.io/badge/MapLibre_GL-3178C6?style=flat" alt="MapLibre GL" height="20"> | Bibliothèque de cartographie interactive open-source. |

---

## 🏗️ **Architecture du Projet**

Le projet utilise l'**App Router** de Next.js pour une architecture moderne et basée sur les répertoires.

```
service-domicile/
├── 📁 app/
│   ├── 🔐 (auth)/            # Routes d'authentification (groupées)
│   ├── 🌐 api/               # Endpoints de l'API backend
│   ├── 📊 dashboard/         # Layouts et pages des tableaux de bord
│   │   ├── admin/
│   │   ├── client/
│   │   └── professional/
│   ├── 🧩 components/        # Composants spécifiques aux pages
│   └── layout.tsx            # Layout principal de l'application
│   └── page.tsx              # Page d'accueil
├── 🎨 components/            # Composants UI réutilisables (atomes, molécules)
├── 🪝 hooks/                 # Hooks React personnalisés
├── 📚 lib/                   # Fonctions et configurations partagées
├── 🔧 util/                  # Fonctions utilitaires
├── 🎯 types/                 # Définitions TypeScript globales
└── 🌍 public/               # Fichiers statiques (images, polices)
```

---

## 🚀 **Installation & Lancement**

### **Prérequis**
- **Node.js** (version 20.x ou supérieure)
- **npm** ou **yarn**
- **MySQL** (local ou distant)

### **Étapes**

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/nafis589/projetStage.git
    cd projetStage
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement :**
    Créez un fichier `.env.local` à la racine et remplissez-le sur la base de `.env.example` (s'il existe) ou avec les variables suivantes :
    ```env
    # Base de données
    DB_HOST=localhost
    DB_USER=votre_utilisateur
    DB_PASSWORD=votre_mot_de_passe
    DB_NAME=geservice_db

    # NextAuth
    NEXTAUTH_SECRET=un_secret_complexe_et_aleatoire
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Démarrer le serveur de développement :**
    ```bash
    npm run dev
    ```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

---

## 🤝 **Contribution**

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet, veuillez suivre ces étapes :

1.  **Forkez** le projet.
2.  Créez une nouvelle branche : `git checkout -b feature/ma-super-fonctionnalite`.
3.  Faites vos modifications et **commitez** : `git commit -m 'Ajout de ma super fonctionnalité'`.
4.  **Pushez** vers votre branche : `git push origin feature/ma-super-fonctionnalite`.
5.  Ouvrez une **Pull Request**.

---

## 📄 **Licence**

Ce projet est sous licence privée. Tous les droits sont réservés.

<div align="center">
  <small>Développé avec ❤️ par l'équipe Geservice</small>
</div>

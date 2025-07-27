# ProjetStage

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

## Description du projet

**ProjetStage** est une application web développée avec Next.js et React, permettant aux utilisateurs de gérer des réservations et des profils professionnels. Ce projet vise à offrir une interface conviviale pour la gestion des utilisateurs, des réservations et des avis, tout en intégrant des fonctionnalités d'authentification.

### Fonctionnalités clés
- Authentification des utilisateurs (connexion et inscription)
- Gestion des profils professionnels
- Système de réservation
- Affichage des avis des utilisateurs
- Tableau de bord pour les administrateurs et les professionnels

## Stack technique

| Technologie       | Description                               |
|-------------------|-------------------------------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) Node.js | Environnement d'exécution JavaScript côté serveur |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) React | Bibliothèque JavaScript pour construire des interfaces utilisateur |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) Next.js | Framework React pour le rendu côté serveur et la génération de sites statiques |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) TypeScript | Superset de JavaScript qui ajoute des types statiques |

## Instructions d'installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes d'installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/nafis589/projetStage.git
   cd projetStage
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env.local` à la racine du projet et ajoutez les variables nécessaires (par exemple, pour la base de données ou les clés API). Un exemple de fichier `.env` peut être fourni.

4. Démarrez le serveur de développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## Utilisation

Une fois le serveur en cours d'exécution, ouvrez votre navigateur et accédez à `http://localhost:3000` pour interagir avec l'application.

### Exemples d'utilisation
- Pour vous inscrire, accédez à la page d'inscription.
- Pour vous connecter, allez à la page de connexion.
- Les utilisateurs peuvent rechercher des professionnels et consulter leurs profils.

## Structure du projet

Voici un aperçu de la structure du projet :

```
projetStage/
├── app/
│   ├── (auth)/                       # Gestion des authentifications
│   │   ├── login/                    # Composants de connexion
│   │   ├── professionel/              # Composants pour les professionnels
│   │   └── register/                  # Composants d'inscription
│   ├── api/                           # API pour la gestion des données
│   │   ├── admin-profile/             # Routes pour le profil admin
│   │   ├── bookings/                  # Routes pour les réservations
│   │   ├── clientsProfil/             # Routes pour les profils clients
│   │   └── reviews/                   # Routes pour les avis
│   ├── components/                    # Composants réutilisables
│   ├── dashboard/                     # Composants pour le tableau de bord
│   ├── globals.css                    # Styles globaux
│   ├── layout.tsx                     # Mise en page principale
│   └── page.tsx                       # Page d'accueil
└── public/                            # Ressources publiques
```

### Explication des fichiers principaux
- `app/api/` : Contient les routes API pour gérer les différentes fonctionnalités de l'application.
- `app/components/` : Composants React réutilisables pour l'interface utilisateur.
- `app/layout.tsx` : Définit la mise en page de l'application.
- `app/globals.css` : Fichier CSS pour les styles globaux de l'application.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :
1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -m 'Ajout d\'une nouvelle fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

Merci de votre intérêt pour le projet !

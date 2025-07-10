# Service à Domicile

Une application web pour trouver et réserver des services à domicile.

## Fonctionnalités principales

- Authentification des utilisateurs (inscription et connexion)
- Recherche de prestataires de services
- Réservation de services
- Tableau de bord pour les utilisateurs et les prestataires

## Structure du projet

Le projet est construit avec Next.js et suit la structure de l'App Router.

- `app/`: Contient les pages et les routes de l'application.
  - `(auth)/`: Gère l'authentification (inscription, connexion).
  - `api/`: Contient les routes de l'API.
  - `components/`: Contient les composants React réutilisables.
  - `dashboard/`: Contient les pages du tableau de bord.
- `components/`: Contient les composants React globaux.
- `hooks/`: Contient les hooks React personnalisés.
- `lib/`: Contient les fonctions et les utilitaires de la bibliothèque.
- `public/`: Contient les actifs statiques.
- `types/`: Contient les définitions de types TypeScript.
- `util/`: Contient les fonctions utilitaires.

## Technologies utilisées

- **Framework:** [Next.js](https://nextjs.org/)
- **Langage:** [TypeScript](https://www.typescriptlang.org/)
- **Style:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentification:** [NextAuth.js](https://next-auth.js.org/)
- **Base de données:** [MySQL](https://www.mysql.com/)
- **Gestion de l'état:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Composants d'interface utilisateur:** [Radix UI](https://www.radix-ui.com/)

## Instructions d'installation et d'exécution

1.  **Cloner le dépôt:**

    ```bash
    git clone https://github.com/votre-utilisateur/service-domicile.git
    cd service-domicile
    ```

2.  **Installer les dépendances:**

    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement:**
    Créez un fichier `.env.local` à la racine du projet et ajoutez les variables d'environnement nécessaires (par exemple, les informations d'identification de la base de données, le secret de NextAuth).

4.  **Exécuter les migrations de la base de données:**
    Assurez-vous que votre base de données MySQL est en cours d'exécution et exécutez les migrations de base de données nécessaires pour créer les tables `users` et `clients`.

5.  **Démarrer le serveur de développement:**

    ```bash
    npm run dev
    ```

    Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Instructions de contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue pour discuter des changements majeurs avant de soumettre une pull request.

## Historique des modifications

- **v0.1.0 (Date):**
  _ Initialisation du projet avec Next.js, TypeScript et Tailwind CSS.
  _ Mise en place de l'authentification des utilisateurs avec NextAuth.js. \* Création de la structure de base de l'application.
  Crée un composant React TypeScript nommé CustomMap utilisant MapLibre GL JS. Le composant doit :

Être écrit en .tsx.

Utiliser le hook useEffect pour initialiser la carte une seule fois.

Accepter une id en props pour identifier dynamiquement le conteneur HTML de la carte (afin que je puisse choisir où l’afficher).

Afficher une carte centrée par défaut sur des coordonnées données (ex : [6.1319, 1.2228] pour Lomé, Togo).

Utiliser une hauteur et une largeur de 100% (le parent définira les dimensions).

Inclure un seul marqueur par défaut avec popup de test.

Utiliser le CDN ou l'import de maplibre-gl (selon que tu choisis une version client ou SSR).

Être compatible avec Next.js (éviter les erreurs de SSR en s'assurant que la carte se charge côté client uniquement).

Le style de la carte peut être celui de MapTiler ou OpenMapTiles. Ne pas utiliser Mapbox.

Le code doit être modulaire, propre, réutilisable et prêt à être stylé avec Tailwind si besoin.

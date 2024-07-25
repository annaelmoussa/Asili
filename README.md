# Guide d'installation du projet

Ce guide vous accompagnera dans le processus d'installation et de lancement du projet en utilisant Docker Compose.

## Prérequis

- Docker
- Docker Compose
- Git (pour cloner le dépôt)

## Structure du projet

Le projet a la structure suivante :

```
racine/
├── backend/         # Express avec TSOA
├── frontend/        # Frontend Vue.js
├── fakeApiLaPoste/  # API La Poste pour la gestion des livraisons
├── docker-compose.yml
├── .env
├── rgpd/            # Documents relatifs au RGPD
└── README.md
```

## Étapes d'installation

1. Clonez le dépôt :

   ```
   git clone https://github.com/annaelmoussa/Asili
   cd Asili
   ```

2. Configurez les variables d'environnement :

   Créez trois fichiers `.env` : un dans le répertoire racine, un dans le répertoire `backend`, et un dans le répertoire `frontend`. Ajoutez les variables suivantes dans chaque fichier selon les besoins :

   `.env` à la racine :

   ```
   VITE_API_BASE_URL=http://localhost:3000
   VITE_STRIPE_PUBLIC_KEY=pk_test_556PJ
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   MONGO_INITDB_DATABASE=asili
   JWT_SECRET=secret
   ACME_EMAIL=mail@mail.com
   TRAEFIK_AUTH=test:$$apr1$$Q7Q7Q7Q7$$
   PORT=3000
   MONGO_URI=mongodb://mongo:27017/asili
   POSTGRES_URI=postgres://postgres:password@postgres:5432/postgres
   JWT_SECRET=secret
   EMAIL_USER=no.reply.sportco@example.com
   EMAIL_PASSWORD=password
   BASE_URL=http://localhost:8080
   REDIS_URL=redis://redis:6379
   STRIPE_SECRET_KEY=sk_test_91P
   ```

   `.env` dans le backend :

   ```
   VITE_API_BASE_URL=http://localhost:3000
   VITE_STRIPE_PUBLIC_KEY=pk_test_556PJ
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   MONGO_INITDB_DATABASE=asili
   JWT_SECRET=secret
   ACME_EMAIL=mail@mail.com
   TRAEFIK_AUTH=test:$$apr1$$Q7Q7Q7Q7$$
   PORT=3000
   MONGO_URI=mongodb://mongo:27017/asili
   POSTGRES_URI=postgres://postgres:password@postgres:5432/postgres
   JWT_SECRET=secret
   EMAIL_USER=no.reply.sportco@example.com
   EMAIL_PASSWORD=password
   BASE_URL=http://localhost:8080
   REDIS_URL=redis://redis:6379
   STRIPE_SECRET_KEY=sk_test_91P
   ```

   `.env` dans le frontend :

   ```
   VITE_API_BASE_URL=http://localhost:3000
   VITE_STRIPE_PUBLIC_KEY=pk_test_556PJ
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   MONGO_INITDB_DATABASE=asili
   JWT_SECRET=secret
   ACME_EMAIL=mail@mail.com
   TRAEFIK_AUTH=test:$$apr1$$Q7Q7Q7Q7$$
   PORT=3000
   MONGO_URI=mongodb://mongo:27017/asili
   POSTGRES_URI=postgres://postgres:password@postgres:5432/postgres
   JWT_SECRET=secret
   EMAIL_USER=no.reply.sportco@example.com
   EMAIL_PASSWORD=password
   BASE_URL=http://localhost:8080
   REDIS_URL=redis://redis:6379
   STRIPE_SECRET_KEY=sk_test_91P
   ```

3. Construisez et démarrez les conteneurs Docker :

   ```
   docker-compose up --build
   ```

   Cette commande va construire les images pour vos services et démarrer les conteneurs.

4. Une fois les conteneurs démarrés, vous pouvez accéder à :
   - Frontend : http://localhost:8080
   - API Backend : http://localhost:3000
   - pgAdmin : http://localhost:5050
   - Adminer : http://localhost:5055

## Informations supplémentaires

- Le backend utilise Express avec TSOA et se trouve dans le répertoire `backend`.
- Le frontend est construit avec Vue.js et se trouve dans le répertoire `frontend`.
- Les données MongoDB sont persistées dans le volume `mongo_data`.
- Les données PostgreSQL sont persistées dans le volume `postgres_data`.
- Assurez-vous de remplacer toutes les valeurs d'exemple dans les fichiers `.env` par votre configuration réelle.

## Informations supplémentaires

- Le backend utilise Express avec TSOA et se trouve dans le répertoire `backend`.
- Le frontend est construit avec Vue.js et se trouve dans le répertoire `frontend`.
- Les données MongoDB sont persistées dans le volume `mongo_data`.
- Les données PostgreSQL sont persistées dans le volume `postgres_data`.
- Assurez-vous de remplacer toutes les valeurs d'exemple dans les fichiers `.env` par votre configuration réelle.
- Le dossier `rgpd` contient tous les documents relatifs au RGPD.

## Environnement de production

L'application en production est accessible à l'adresse : https://littleyarns.org/

## Comptes de test

Pour tester l'application, vous pouvez utiliser les comptes suivants :

1. Rôle User :

   - Email : user@example.com
   - Mot de passe : password

2. Rôle Admin :

   - Email : admin@example.com
   - Mot de passe : password

3. Rôle Store Keeper :
   - Email : storekeeper@example.com
   - Mot de passe : password

## Contributeurs et fonctionnalités

### Annaël Moussa (GitHub: annaelmoussa)

- Recherche produits
- Gestion des stocks
- Panel d'administration
- "Suppression" de compte
- Système de réservation de 15min pour les paniers
- Composant CRUD
- Fake API Laposte

### Lotfi Touil (GitHub: Lotfi-Touil)

- Système de paiement via Stripe (paiement + webhooks)
- Gestion de livraison
- Système de commande avec historique
- Panier Hors-ligne + Panier en ligne
- Dénormalisation PostgreSQL/MongoDB

### Jason Alfonso (GitHub: JasonAfs)

- Gestion d'alerte par mail (Visibilité de l'ensemble des alertes sur le compte client)
- Authentification

### Raouf Abdou Msa (GitHub: raouf-abdoumsa)

- Design Frontend
- Tests unitaires
- Droits / RGPD
- Gestion d'erreur

## Dépannage

Si vous rencontrez des problèmes lors de l'installation ou de l'exécution du projet, veuillez suivre ces étapes :

1. Assurez-vous que tous les ports requis sont libres et non utilisés par d'autres applications.

2. Vérifiez que toutes les variables d'environnement sont correctement définies dans les fichiers `.env` respectifs.

3. En cas de problème avec le lancement du projet, suivez ces étapes dans l'ordre :

   a. Dans le répertoire backend :

   ```
   cd backend
   npm run build
   ```

   b. Dans le répertoire frontend :

   ```
   cd frontend
   npm run build
   npm run generate-api
   ```

   c. Retournez à la racine du projet et exécutez :

   ```
   docker compose down -v && docker compose up --build -d
   ```

   Cette séquence de commandes va reconstruire les projets backend et frontend, générer l'API dans le frontend, puis recréer et redémarrer tous les conteneurs Docker.

4. Si les problèmes persistent, consultez les logs Docker pour tout message d'erreur :
   ```
   docker-compose logs
   ```

Pour toute assistance supplémentaire, veuillez contacter le responsable du projet.

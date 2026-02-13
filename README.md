# PawConnect Backend

API REST Node.js/Express pour PawConnect: authentification, signalements, notifications et gestion des établissements.

## Fonctionnalités
- Auth JWT (`/auth/login`, `/auth/signup`)
- Gestion des signalements (`/animals`)
- Notifications utilisateur (`/notifications`)
- Signature Cloudinary pour upload côté frontend (`/upload/signature`)
- Limitation de débit (`globalLimiter`, `authLimiter`, `apiLimiter`)
- Gestion d’erreurs unifiée via `AppError`

## Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Validation (`express-validator`)
- Sécurité (`helmet`, `express-rate-limit`)
- Upload media signé (`cloudinary`)

## Installation
```bash
cd backend
npm install
```

## Variables d’environnement
Créer ton fichier local à partir de l’exemple:

```bash
cp .env.example .env
```

Puis compléter les valeurs dans `.env`.

Contenu attendu (voir `backend/.env.example`):

```env
PORT=3000
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_URL=replace_with_your_cloudinary_url
```

Variables effectivement utilisées dans le code:
- `PORT` (`bin/www`)
- `CONNECTION_STRING` (`models/connection.js`)
- `JWT_SECRET` (`middlewares/auth.middleware.js`, `services/auth.service.js`)
- `CLOUDINARY_URL` (`controllers/upload.controller.js`)

## Lancement
```bash
npm start
```

Le serveur démarre via `node ./bin/www`.

## Architecture
```text
backend/
  app.js                # bootstrap Express (middlewares, routes, error handler)
  bin/www               # point d'entrée HTTP
  controllers/          # orchestration HTTP -> service
  services/             # logique métier
  repositories/         # accès MongoDB
  models/               # schémas Mongoose
  middlewares/          # auth, validation, erreurs
  errors/               # AppError + mapping code -> status HTTP
  utils/                # utilitaires transverses
  routes/               # définition des endpoints
```

## Endpoints principaux

### Auth
- `POST /auth/signup`
- `POST /auth/login`

### Signalements
- `GET /animals/me` (JWT requis)
- `POST /animals` (JWT requis, rôle `civil`)
- `PATCH /animals/:id/photo` (JWT requis, reporter uniquement)
- `PATCH /animals/:id` (JWT requis, rôle `agent`)

### Notifications
- `GET /notifications` (JWT requis)
- `PATCH /notifications/:id/read` (JWT requis)
- `PATCH /notifications/read-all` (JWT requis)

### Upload
- `GET /upload/signature` (JWT requis)

### Etablissements
- `GET /establishments`
- `POST /establishments`

## Authentification
Header attendu sur routes protégées:

```http
Authorization: Bearer <token>
```

Le token contient:
- `userId`
- `role` (`civil` ou `agent`)
- `establishmentId` (agents uniquement)

## Format d’erreur
Les erreurs métier passent par `AppError` et sont normalisées par `middlewares/error.middleware.js`:

```json
{
  "error": "INVALID_INPUT",
  "message": "Validation failed",
  "details": []
}
```

Codes usuels: `INVALID_INPUT`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `MISCONFIGURED`, `SERVER_ERROR`.

## Rate limiting
- Global: `100 req / minute`
- Auth: `5 req / 15 minutes`
- API métier: `15 req / 15 minutes`

## Tests
Jest/Supertest sont présents. Aucun script `test` n’est défini dans `package.json`.

Exécution manuelle:
```bash
npx jest
```

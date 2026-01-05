# 🐾 PawConnect – Backend API (MVP)

Backend REST de PawConnect, responsable de la gestion des utilisateurs, des signalements, de l’authentification et du stockage des données. Ce dépôt utilise Node.js + Express et MongoDB (via Mongoose). Le serveur démarre via `node ./bin/www` (script `npm start`).

---

## ⚙️ Fonctionnalités clés

1. Authentification & sécurité
   - Inscription / connexion utilisateur
   - Authentification via JWT (jsonwebtoken)
   - Middleware de protection des routes (voir `middleware/`)
   - Gestion des rôles (citoyen / agent) gérée dans les middlewares et modèles

2. Gestion des signalements
   - Création, lecture, mise à jour, suppression (routes dans `routes/`)
   - Attribution d’un agent à un signalement (logique dans `services/` / `modules/`)
   - Historique des changements de statut (ex. `test-data/` / modèles d’action)

3. Upload & médias
   - Upload de photos de signalement (utilisation d’`express-fileupload`)
   - Stockage via Cloudinary (dépendance `cloudinary`) — vérifier la configuration dans `services/` ou `modules/`

4. Base de données
   - MongoDB + Mongoose (`models/` contient les schémas : User, Report, etc.)
   - Connexion et logique DB centralisées dans `app.js` / modules de config

---

## 🛠 Stack technique – Backend (observé)

- Runtime : Node.js  
- Framework : Express.js  
- Base de données : MongoDB (Mongoose)  
- Auth : JWT (jsonwebtoken)  
- Uploads : cloudinary + express-fileupload  
- Hashing : bcrypt  
- Utilitaires : uid2 / uniqid / morgan  
- Tests : jest, supertest  
- Démarrage : `node ./bin/www` (`npm start`)  
- Déploiement possible : Vercel / Railway / Render (fichier `vercel.json` présent)

---

## 🚀 Installation & Lancement

1. Pré-requis
   - Node.js (v18+ recommandé)
   - MongoDB (local ou Atlas)

2. Setup
```bash
# Cloner le repo
git clone https://github.com/Yipno/PawConnect-backend.git
cd PawConnect-backend

# Installer les dépendances
npm install
```

3. Configuration des variables d’environnement
Créer un fichier `.env` à la racine (ne pas committer) avec au minimum :
```
PORT=4000
NODE_ENV=development

# MongoDB
CONNECTION_STRING=mongodb+srv://...mongodb.net/pawconnect

# Auth
JWT_SECRET=une_cle_super_secrete
JWT_EXPIRES_IN=7d

# Cloudinary (si utilisé)
# Option A
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
# Option B (séparé)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

4. Lancer le serveur
```bash
# production / start défini dans package.json
npm start
```

Conseil pour le développement (auto-reload) :
```bash
# installer nodemon globalement ou en devDependency
npx nodemon ./bin/www
# ou ajouter un script "dev": "nodemon ./bin/www" dans package.json
```

---

## 📂 Structure du projet (extrait réel)

/
├── app.js            # Configuration de l'application Express  
├── bin/              # Script de démarrage (./bin/www)  
├── routes/           # Déclaration des routes API  
├── models/           # Schémas Mongoose (User, Report, ...)  
├── middleware/       # Auth, validations, gestion d'erreurs  
├── services/         # Logique métier (uploads, notifications, etc.)  
├── modules/          # Helpers / modules réutilisables  
├── public/           # Statiques / assets temporaires  
├── tests/            # Tests unitaires / d'intégration  
├── test-data/        # Données de seed / exemples  
├── utils/            # Fonctions utilitaires  
├── vercel.json       # Config déploiement Vercel (optionnel)  
├── package.json
└── yarn.lock

---

## 🧪 Tests

Le projet embarque Jest et Supertest en dépendances. `package.json` ne contient pas de script `test` par défaut — lancer les tests ainsi :
```bash
npx jest
# ou ajouter dans package.json : "test": "jest" puis npm test
```

---

## 🔒 Sécurité & bonnes pratiques

- Ne pas committer le fichier `.env`.
- Protéger les routes sensibles via JWT et vérification de rôle dans les middlewares.
- Stocker les secrets (JWT, Cloudinary) dans le provider de déploiement.
- TODO : Ajouter rate-limiting si l’API est exposée publiquement.

---

## 🛣 Roadmap (post‑MVP)

- Notifications push / WebSockets pour mise à jour en temps réel
- Dashboard admin (statistiques, modération)
- Audit / logs d’actions et sécurité renforcée

---

## 👤 Auteur

Projet développé par Aubry & l'équipe PawConnect 
Développeur Web & Mobile – Full Stack  
Projet MVP réalisé dans le cadre d’un bootcamp de la Capsule, en 13 jours maximum et par une équipe de 5 developpeurs juniors.

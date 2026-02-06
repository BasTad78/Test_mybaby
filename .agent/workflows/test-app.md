---
description: Comment tester l'application MyBaby
---

// turbo-all
## 1. Démarrer le Backend
Le backend doit être lancé pour que le frontend puisse communiquer avec la base de données.

1. Allez dans le dossier `backend` : `cd backend`
2. Installez les dépendances : `npm install`
3. Lancez le serveur : `npm start`
   > Le serveur devrait afficher "Serveur lancé sur le port 3000" et "Connecté à la base de données".

## 2. Lancer le Frontend
Comme l'application utilise des requêtes `fetch`, il est recommandé de la lancer via un serveur local.

1. Utilisez `npx serve` ou l'extension "Live Server" de VS Code.
2. Si vous avez `serve` d'installé : `npx serve frontend`
3. Ouvrez votre navigateur sur `http://localhost:3000` (ou le port indiqué par `serve`).

## 3. Scénario de Test Recommandé

### A. Inscription et Connexion
1. Allez sur la page d'accueil.
2. Cliquez sur **Connexion / Inscription**.
3. Créez un nouveau compte joueur.
4. Une fois inscrit, déconnectez-vous et reconnectez-vous pour vérifier que le compte est bien enregistré en base.

### B. Découverte de la Carte
1. Allez sur l'onglet **Carte**.
2. Vérifiez que les marqueurs s'affichent (ce sont les lieux récupérés depuis la base de données).
3. Cliquez sur un marqueur pour voir les détails.

### C. Classement
1. Allez sur l'onglet **Classement**.
2. Vérifiez que la liste des joueurs s'affiche avec leurs scores ELO.

### D. Enregistrement d'un Match
1. Allez sur l'onglet **Match**.
2. Proposez un duel ou enregistrez un résultat.
3. Vérifiez qu'aucune erreur ne s'affiche et que les données sont persistées.

## 4. Debug
En cas de problème, vérifiez la console du navigateur (F12) pour voir les erreurs d'appels API.
- Assurez-vous que le backend est bien sur le port 3000.
- Vérifiez le fichier `.env` dans le dossier `backend` pour les accès à la base de données.

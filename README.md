# 🚉 Dashboard Trains – Nivelles (React + CSS)

## 🧩 Description du projet  
Il s’agit d’un mini-dashboard React qui affiche en temps réel les informations relatives aux trains au départ et à l’arrivée de la gare de Nivelles (Bruxelles ↔ Nivelles ↔ Charleroi).  
Le but est de fournir une vue claire et actualisée, pouvant être affichée sur un écran de bureau ou une télévision interne.

## 🎯 Fonctionnalités principales
- ✅ Affichage des prochains départs et arrivées pour les deux prochaines heures.
- ✅ Calcul du retard moyen pour les trains de la prochaine heure.
- ✅ Calcul du pourcentage de trains annulés durant les trois dernières heures.
- ✅ Actualisation automatique toutes les 60 secondes.
- ✅ Affichage de l’heure actuelle dans l’en-tête du dashboard.
- ✅ Interface simple et claire, stylisée avec un fichier CSS externe.

## 🧠 Données et API utilisées
Les données proviennent de l’API publique iRail ([documentation officielle](https://api.irail.be)).

### Endpoints utilisés :
- **Départs** : [Liveboard départs Nivelles](https://api.irail.be/liveboard/?station=Nivelles&arrdep=departure&format=json)  
- **Arrivées** : [Liveboard arrivées Nivelles](https://api.irail.be/liveboard/?station=Nivelles&arrdep=arrival&format=json)

## 🛠️ Technologies utilisées
- ⚛️ React.js  
- 🎨 CSS externe  
- 📡 Fetch API  
- ⏱️ Hooks React (`useState`, `useEffect`)  
- 🧮 JavaScript 

## 💻 Installation et exécution
1. Cloner le dépôt  

    git clone https://github.com/ton-utilisateur/dashboard-trains-nivelles.git
    cd dashboard-trains-nivelles

2. Installer les dépendances

    npm install


3. Lancer le projet

    npm start


4 . Accéder à l’application : http://localhost:3000

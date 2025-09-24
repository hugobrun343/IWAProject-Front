# IWAProject-Front

## 📱 Frontend Mobile - Application de Garde d'Animaux

**Partie Front du Projet IWA de la spécialisation DAMS5 à Polytech Montpellier**

---

## 🎯 Description du Projet

IWAProject-Front est une application mobile React Native développée dans le cadre du projet IWA (Innovation Web Application) de la spécialisation DAMS5 (Développement d'Applications Mobiles et Systèmes) à Polytech Montpellier.

Cette application permet aux utilisateurs de :
- 🔍 Rechercher des services de garde d'animaux
- 💖 Ajouter des annonces en favoris
- 📝 Créer et gérer leurs propres annonces
- 💬 Communiquer avec les propriétaires
- 👤 Gérer leur profil et leurs abonnements

---

## 🛠️ Technologies Utilisées

- **React Native** - Framework de développement mobile
- **Expo** - Plateforme de développement et déploiement
- **TypeScript** - Langage de programmation typé
- **React Navigation** - Navigation entre les écrans
- **Expo Vector Icons** - Bibliothèque d'icônes
- **React Native Paper** - Composants UI Material Design

---

## 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base
│   ├── BottomNavigation.tsx
│   ├── SearchHeader.tsx
│   ├── ListingCard.tsx
│   ├── ListingsGrid.tsx
│   ├── ListingDetailPage.tsx
│   ├── ProfilePage.tsx
│   ├── FavoritesPage.tsx
│   ├── MessagesPage.tsx
│   ├── CreateListingPage.tsx
│   ├── MyListingsPage.tsx
│   ├── GuardHistoryPage.tsx
│   ├── ReviewsPage.tsx
│   ├── SubscriptionPage.tsx
│   ├── PaymentsPage.tsx
│   └── EditProfilePage.tsx
├── styles/              # Styles globaux
└── main.tsx            # Point d'entrée de l'application
```

---

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI
- Un émulateur mobile ou un appareil physique

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd IWAProject-Front

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

### Commandes disponibles
```bash
npm start          # Démarrer le serveur de développement
npm run android    # Lancer sur Android
npm run ios        # Lancer sur iOS
npm run web        # Lancer sur le web
```

---

## 📱 Fonctionnalités Principales

### 🏠 Page d'Accueil
- Recherche d'annonces avec filtres
- Affichage des annonces populaires
- Navigation vers les détails

### ❤️ Favoris
- Liste des annonces favorites
- Gestion des favoris

### ➕ Création d'Annonce
- Formulaire de création d'annonce
- Upload de photos
- Configuration des préférences

### 💬 Messages
- Interface de messagerie
- Conversations avec les propriétaires
- Recherche de conversations

### 👤 Profil
- Gestion du profil utilisateur
- Historique des gardes
- Avis et évaluations
- Abonnements et paiements

---

## 🎨 Design et UX

L'application suit les principes du Material Design avec :
- Interface intuitive et moderne
- Navigation fluide entre les écrans
- Composants réutilisables et cohérents
- Thème personnalisable
- Support des modes sombre/clair

---

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` à la racine du projet :
```
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_APP_NAME=IWAProject
```

### Configuration Expo
Le fichier `app.json` contient la configuration Expo :
- Nom de l'application
- Version
- Icônes et splash screen
- Permissions

---

## 📚 Documentation

### Composants UI
Les composants UI sont documentés dans le dossier `src/components/ui/` :
- `Button` - Boutons personnalisés
- `Card` - Cartes d'affichage
- `Input` - Champs de saisie
- `Badge` - Badges et étiquettes
- `Icon` - Icônes vectorielles
- `ImageWithFallback` - Images avec fallback

### Navigation
L'application utilise React Navigation avec :
- Bottom Tab Navigation pour les écrans principaux
- Stack Navigation pour les écrans secondaires
- Navigation conditionnelle basée sur l'état de l'utilisateur

---

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage
```

---

## 📦 Déploiement

### Build de production
```bash
# Build pour Android
expo build:android

# Build pour iOS
expo build:ios
```

### Publication sur les stores
```bash
# Publier sur Google Play
expo upload:android

# Publier sur App Store
expo upload:ios
```

---

## 👥 Équipe de Développement

**Spécialisation DAMS5 - Polytech Montpellier**
- Développement dans le cadre du projet IWA
- Encadrement par l'équipe pédagogique de Polytech Montpellier

---

## 📄 Licence

Ce projet est développé dans le cadre académique de la spécialisation DAMS5 à Polytech Montpellier.

---

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

---

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation Expo

---

**Développé avec ❤️ par l'équipe DAMS5 de Polytech Montpellier**
# GuardHome React Native

Une application mobile React Native pour la garde d'animaux et de domiciles, convertie depuis le projet React original.

## 📱 Fonctionnalités

- **Recherche d'annonces** : Interface de recherche avec filtres et géolocalisation
- **Navigation par onglets** : Navigation fluide entre les différentes sections
- **Gestion des favoris** : Sauvegarde des annonces préférées
- **Profil utilisateur** : Gestion complète du profil et des paramètres
- **Messages** : Interface de messagerie (préparé pour l'intégration)
- **Création d'annonces** : Interface pour publier de nouvelles demandes de garde

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI : `npm install -g @expo/cli`
- Un émulateur iOS/Android ou l'app Expo Go sur votre téléphone

### Étapes d'installation

1. **Cloner et naviguer vers le projet**
   ```bash
   cd GuardHomeReactNative
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le projet**
   ```bash
   npm start
   # ou
   expo start
   ```

4. **Lancer sur un appareil**
   - **iOS** : Appuyez sur `i` dans le terminal ou scannez le QR code avec l'app Camera
   - **Android** : Appuyez sur `a` dans le terminal ou scannez le QR code avec l'app Expo Go
   - **Web** : Appuyez sur `w` dans le terminal

## 🏗️ Structure du projet

```
src/
├── components/           # Composants de l'application
│   ├── ui/              # Composants UI réutilisables
│   │   ├── Button.tsx   # Composant bouton
│   │   ├── Card.tsx     # Composants de carte
│   │   ├── Input.tsx    # Composant input
│   │   ├── Badge.tsx    # Composant badge
│   │   ├── Icon.tsx     # Gestion des icônes
│   │   └── ImageWithFallback.tsx # Composant image avec fallback
│   ├── BottomNavigation.tsx      # Navigation par onglets
│   ├── SearchHeader.tsx          # En-tête de recherche
│   ├── ListingsGrid.tsx          # Grille des annonces
│   ├── ListingCard.tsx           # Carte d'annonce
│   ├── ListingDetailPage.tsx     # Page de détail d'annonce
│   ├── ProfilePage.tsx           # Page de profil
│   ├── FavoritesPage.tsx         # Page des favoris
│   ├── MessagesPage.tsx          # Page des messages
│   ├── CreateListingPage.tsx     # Page de création d'annonce
│   └── ...                       # Autres pages
└── styles/
    └── theme.ts         # Thème et constantes de style
```

## 🎨 Design System

Le projet utilise un système de design cohérent avec :

- **Couleurs** : Palette de couleurs identique au projet React original
- **Typographie** : Tailles et poids de police standardisés
- **Espacement** : Système d'espacement cohérent
- **Composants** : Composants UI réutilisables avec variants

### Couleurs principales

- **Primary** : #4FB286 (Vert principal)
- **Secondary** : #CEB5A7 (Beige secondaire)
- **Background** : #FFFFFF (Blanc)
- **Foreground** : #263D42 (Gris foncé)

## 🔧 Technologies utilisées

- **React Native** : Framework mobile
- **Expo** : Plateforme de développement
- **TypeScript** : Typage statique
- **Expo Vector Icons** : Icônes
- **Expo Image** : Gestion optimisée des images
- **React Native Safe Area Context** : Gestion des zones sécurisées

## 📦 Scripts disponibles

- `npm start` : Démarre le serveur de développement Expo
- `npm run android` : Lance l'application sur Android
- `npm run ios` : Lance l'application sur iOS
- `npm run web` : Lance l'application sur le web

## 🔄 Différences avec le projet React

### Adaptations React Native

1. **Styling** : Remplacement de Tailwind CSS par StyleSheet
2. **Navigation** : Utilisation de la navigation native au lieu du DOM
3. **Icônes** : Remplacement de Lucide React par Expo Vector Icons
4. **Images** : Utilisation d'Expo Image pour les performances
5. **Composants** : Adaptation des composants HTML vers React Native

### Fonctionnalités conservées

- ✅ Interface utilisateur identique
- ✅ Navigation par onglets
- ✅ Système de favoris
- ✅ Pages de profil et paramètres
- ✅ Design responsive
- ✅ Thème de couleurs cohérent

## 🚧 Fonctionnalités à implémenter

- [ ] Intégration API réelle
- [ ] Système de messagerie fonctionnel
- [ ] Géolocalisation réelle
- [ ] Notifications push
- [ ] Système de paiement
- [ ] Upload d'images
- [ ] Authentification utilisateur

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que toutes les dépendances sont installées
2. Redémarrez le serveur Expo
3. Nettoyez le cache : `expo start -c`
4. Vérifiez les logs dans la console

## 📱 Captures d'écran

L'application reproduit fidèlement le design du projet React original avec :
- Interface de recherche intuitive
- Navigation fluide
- Design moderne et épuré
- Expérience utilisateur optimisée pour mobile

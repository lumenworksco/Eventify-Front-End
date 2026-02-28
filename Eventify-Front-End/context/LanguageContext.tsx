'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// ============================
// Types
// ============================

type Locale = 'en' | 'fr' | 'de';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLocales: { code: Locale; name: string; flag: string }[];
}

// ============================
// Available Locales
// ============================

const availableLocales: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// ============================
// Translations
// ============================

const translations: Record<Locale, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.cities': 'Cities',
    'nav.events': 'Events',
    'nav.addEvent': 'Add Event',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.venues': 'Venues',
    'nav.welcome': 'Welcome, {name}',
    
    // Home page
    'home.title': 'Discover live events near you',
    'home.subtitle': 'Find concerts, comedy, film and community events at venues across Belgian cities. Filter, explore and add your own events.',
    'home.browseEvents': 'Browse Events',
    'home.exploreCities': 'Explore Cities',
    'home.whatYouCanDo': 'What you can do',
    'home.browseTitle': 'Browse curated events',
    'home.browseDesc': 'Filter by city or type to find what you like.',
    'home.discoverTitle': 'Discover venues',
    'home.discoverDesc': 'See venue bios and upcoming schedules.',
    'home.addTitle': 'Add events',
    'home.addDesc': 'Share your event with the community quickly.',
    'home.badgeFree': 'Free',
    'home.badgeLocal': 'Local',
    'home.badgeQuick': 'Quick',
    
    // Events page
    'events.title': 'Events Overview',
    'events.subtitle': 'Browse all upcoming events across venues. Use the filters to narrow results.',
    'events.filterCity': 'Filter by city',
    'events.filterType': 'Filter by type',
    'events.allCities': 'All cities',
    'events.allTypes': 'All types',
    'events.noEvents': 'No events found matching the filters.',
    'events.loading': 'Loading events...',
    'events.ticketsAvailable': '{count} tickets available',
    'events.viewSchedule': 'View schedule',
    'events.type': 'Type',
    
    // Add Event page
    'addEvent.title': 'Add / Modify Event',
    'addEvent.subtitle': 'Create a new event and assign it to one or more venues. Events are stored in the database.',
    'addEvent.titleField': 'Title',
    'addEvent.venue': 'Venue(s)',
    'addEvent.venueHint': '(Ctrl+click for multiple)',
    'addEvent.date': 'Date',
    'addEvent.type': 'Type',
    'addEvent.typePlaceholder': 'music / comedy / film',
    'addEvent.startTime': 'Start Time',
    'addEvent.endTime': 'End Time',
    'addEvent.availableTickets': 'Available Tickets',
    'addEvent.ticketsPlaceholder': 'Leave empty for unlimited',
    'addEvent.description': 'Description',
    'addEvent.descriptionPlaceholder': 'Short description (optional)',
    'addEvent.save': 'Save event',
    'addEvent.saving': 'Saving...',
    'addEvent.reset': 'Reset',
    'addEvent.success': 'Event "{title}" created successfully!',
    'addEvent.validationErrors': 'Validation errors:',
    'addEvent.loginRequired': 'You must be logged in to add events.',
    'addEvent.noPermission': 'You don\'t have permission to add events. Only Admins and Organizers can create events.',
    'addEvent.createFailed': 'Failed to create event',
    
    // Validation messages
    'validation.titleRequired': 'Title is required',
    'validation.titleMinLength': 'Title must be at least 2 characters',
    'validation.venueRequired': 'At least one venue must be selected',
    'validation.dateRequired': 'Date is required',
    'validation.dateNotPast': 'Event date cannot be in the past',
    'validation.startTimeRequired': 'Start time is required',
    'validation.endTimeRequired': 'End time is required',
    'validation.endTimeAfterStart': 'End time must be after start time',
    'validation.ticketsPositive': 'Available tickets cannot be negative',
    'validation.usernameRequired': 'Username is required',
    'validation.passwordRequired': 'Password is required',
    
    // Cities page
    'cities.title': 'Cities',
    'cities.subtitle': 'Explore venues grouped by city and see upcoming events at each venue.',
    'cities.noCities': 'No cities found.',
    'cities.noVenues': 'No venues in this city yet.',
    'cities.upcomingEvents': 'Upcoming events:',
    'cities.noEventsYet': 'Nothing to see here yet.',
    'cities.moreEvents': '+ {count} more events',
    'cities.capacity': 'Capacity: {count}',
    
    // Venues listing page
    'venues.title': 'Venues',
    'venues.subtitle': 'Explore all venues across Belgian cities. Click any venue to see its full schedule.',
    'venues.filterCity': 'Filter by city',
    'venues.allCities': 'All cities',
    'venues.noVenues': 'No venues found matching the filters.',
    'venues.eventsCount': '{count} upcoming events',

    // Venue page
    'venue.schedule': 'Schedule',
    'venue.noEvents': 'Nothing to see here yet.',
    'venue.notFound': 'Venue not found',
    'venue.idMissing': 'Venue id missing.',
    'venue.browseCities': 'Browse Cities',
    'venue.backToEvents': '← Back to Events',
    'venue.backToCities': '← Back to Cities',
    'venue.featuring': 'Featuring: {artists}',
    'venue.city': 'City',
    'venue.address': 'Address',
    'venue.noAddress': 'No address available',
    'venue.capacity': 'Capacity',
    
    // Login page
    'login.title': 'Login',
    'login.subtitle': 'Sign in to your account to manage events and purchase tickets.',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.submitting': 'Logging in...',
    'login.error': 'Login failed. Please check your credentials.',
    'login.demoAccounts': 'Demo Accounts',
    'login.demoHint': 'Use one of these accounts to test:',
    'login.noAccount': 'Don\'t have an account?',
    'login.registerLink': 'Register here',
    'login.role': 'Role',
    'login.roleUser': 'User',
    'login.roleOrganizer': 'Organizer',
    'login.roleAdmin': 'Admin',
    
    // Register page
    'register.title': 'Create Account',
    'register.subtitle': 'Register to manage events and purchase tickets.',
    'register.username': 'Username',
    'register.usernamePlaceholder': 'Choose a username',
    'register.password': 'Password',
    'register.passwordPlaceholder': 'Choose a password',
    'register.confirmPassword': 'Confirm Password',
    'register.confirmPasswordPlaceholder': 'Confirm your password',
    'register.submit': 'Create Account',
    'register.submitting': 'Creating account...',
    'register.error': 'Registration failed. Please try again.',
    'register.haveAccount': 'Already have an account?',
    'register.loginLink': 'Login here',
    'register.accountType': 'Account Type',
    'register.roleUser': 'User',
    'register.roleOrganizer': 'Organizer',
    'register.userDesc': 'Browse events and purchase tickets',
    'register.organizerDesc': 'Create and manage your own events',

    // Validation
    'validation.usernameMinLength': 'Username must be at least 3 characters',
    'validation.passwordMinLength': 'Password must be at least 6 characters',
    'validation.passwordMismatch': 'Passwords do not match',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.backendError': 'Unable to connect to the backend server. Please try again later.',
    'common.required': 'required',
    'common.retry': 'Retry',
    'common.viewDetails': 'View Details',
    'common.backToEvents': 'Back to Events',
    'common.browseEvents': 'Browse Events',
    'common.viewAllEvents': 'View all events',

    // Event detail page
    'eventDetail.notFound': 'Event not found',
    'eventDetail.pastEvent': 'Past Event',
    'eventDetail.time': 'Time',
    'eventDetail.venue': 'Venue',
    'eventDetail.featuredArtists': 'Featured Artists',
    'eventDetail.tickets': 'Tickets',
    'eventDetail.available': '{count} available',
    'eventDetail.getTickets': 'Get Tickets',
    'eventDetail.about': 'About this event',
    'eventDetail.allVenues': 'All Venues',

    // Home page extra
    'home.upcomingEvents': 'Upcoming Events',
    'home.upcomingSubtitle': 'Don\'t miss what\'s happening next',
    
    // Profile page
    'profile.title': 'My Profile',
    'profile.location': 'Location',
    'profile.city': 'City',
    'profile.eventPreference': 'Event Preference',
    'profile.notSet': 'Not set',
    'profile.preferredCity': 'Preferred City for Home Page',
    'profile.noPreference': 'No preference (show all)',
    'profile.savePreference': 'Save Preference',
    'profile.saving': 'Saving...',
    'profile.preferencesSaved': 'Preferences saved!',
    'profile.saveFailed': 'Failed to save preferences',
    
    // Home page - personalized content
    'home.eventsIn': 'Events in',
    'home.venuesIn': 'Venues in',
    'home.changeCity': 'Change city',
    'home.noEventsInCity': 'No upcoming events in this city',
    'home.personalizeTitle': 'Personalize Your Experience',
    'home.personalizeDesc': 'Set a preferred city to see events and venues tailored to you',
    'home.setPreference': 'Set Preferred City',
    
    // Add Venue page
    'nav.addVenue': 'Add Venue',
    'addVenue.title': 'Add New Venue',
    'addVenue.subtitle': 'Create a new venue where events can be hosted.',
    'addVenue.nameField': 'Venue Name',
    'addVenue.namePlaceholder': 'Enter venue name',
    'addVenue.city': 'City',
    'addVenue.address': 'Address',
    'addVenue.addressPlaceholder': 'Street address (optional)',
    'addVenue.capacity': 'Capacity',
    'addVenue.capacityPlaceholder': 'Maximum number of guests',
    'addVenue.save': 'Create Venue',
    'addVenue.saving': 'Creating...',
    'addVenue.reset': 'Reset',
    'addVenue.success': 'Venue "{name}" created successfully!',
    'addVenue.createFailed': 'Failed to create venue',
    'addVenue.loginRequired': 'You must be logged in to add venues.',
    'addVenue.noPermission': 'You don\'t have permission to add venues. Only Admins can create venues.',
    'addVenue.validation.nameRequired': 'Venue name is required',
    'addVenue.validation.nameMinLength': 'Venue name must be at least 2 characters',
    'addVenue.validation.cityRequired': 'City is required',
    'addVenue.validation.capacityPositive': 'Capacity must be at least 1',
    
    // Footer
    'footer.copyright': '© {year} Eventify',
    'footer.tagline': 'Built for learning — UCLL Full Stack',
    
    // Language
    'language.switch': 'Language',
    'language.en': 'English',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.cities': 'Villes',
    'nav.events': 'Événements',
    'nav.addEvent': 'Ajouter un événement',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.register': 'S\'inscrire',
    'nav.profile': 'Profil',
    'nav.venues': 'Lieux',
    'nav.welcome': 'Bienvenue, {name}',
    
    // Home page
    'home.title': 'Découvrez des événements près de chez vous',
    'home.subtitle': 'Trouvez des concerts, comédies, films et événements communautaires dans les salles des villes belges. Filtrez, explorez et ajoutez vos propres événements.',
    'home.browseEvents': 'Parcourir les événements',
    'home.exploreCities': 'Explorer les villes',
    'home.whatYouCanDo': 'Ce que vous pouvez faire',
    'home.browseTitle': 'Parcourir les événements sélectionnés',
    'home.browseDesc': 'Filtrez par ville ou par type pour trouver ce qui vous plaît.',
    'home.discoverTitle': 'Découvrir les lieux',
    'home.discoverDesc': 'Consultez les descriptions des lieux et les programmes à venir.',
    'home.addTitle': 'Ajouter des événements',
    'home.addDesc': 'Partagez rapidement votre événement avec la communauté.',
    'home.badgeFree': 'Gratuit',
    'home.badgeLocal': 'Local',
    'home.badgeQuick': 'Rapide',
    
    // Events page
    'events.title': 'Aperçu des événements',
    'events.subtitle': 'Parcourez tous les événements à venir dans les différents lieux. Utilisez les filtres pour affiner les résultats.',
    'events.filterCity': 'Filtrer par ville',
    'events.filterType': 'Filtrer par type',
    'events.allCities': 'Toutes les villes',
    'events.allTypes': 'Tous les types',
    'events.noEvents': 'Aucun événement trouvé correspondant aux filtres.',
    'events.loading': 'Chargement des événements...',
    'events.ticketsAvailable': '{count} billets disponibles',
    'events.viewSchedule': 'Voir le programme',
    'events.type': 'Type',
    
    // Add Event page
    'addEvent.title': 'Ajouter / Modifier un événement',
    'addEvent.subtitle': 'Créez un nouvel événement et assignez-le à un ou plusieurs lieux. Les événements sont stockés dans la base de données.',
    'addEvent.titleField': 'Titre',
    'addEvent.venue': 'Lieu(x)',
    'addEvent.venueHint': '(Ctrl+clic pour plusieurs)',
    'addEvent.date': 'Date',
    'addEvent.type': 'Type',
    'addEvent.typePlaceholder': 'musique / comédie / cinéma',
    'addEvent.startTime': 'Heure de début',
    'addEvent.endTime': 'Heure de fin',
    'addEvent.availableTickets': 'Billets disponibles',
    'addEvent.ticketsPlaceholder': 'Laisser vide pour illimité',
    'addEvent.description': 'Description',
    'addEvent.descriptionPlaceholder': 'Courte description (optionnel)',
    'addEvent.save': 'Enregistrer l\'événement',
    'addEvent.saving': 'Enregistrement...',
    'addEvent.reset': 'Réinitialiser',
    'addEvent.success': 'Événement "{title}" créé avec succès !',
    'addEvent.validationErrors': 'Erreurs de validation :',
    'addEvent.loginRequired': 'Vous devez être connecté pour ajouter des événements.',
    'addEvent.noPermission': 'Vous n\'avez pas la permission d\'ajouter des événements. Seuls les administrateurs et organisateurs peuvent créer des événements.',
    'addEvent.createFailed': 'Échec de la création de l\'événement',
    
    // Validation messages
    'validation.titleRequired': 'Le titre est obligatoire',
    'validation.titleMinLength': 'Le titre doit comporter au moins 2 caractères',
    'validation.venueRequired': 'Au moins un lieu doit être sélectionné',
    'validation.dateRequired': 'La date est obligatoire',
    'validation.dateNotPast': 'La date de l\'événement ne peut pas être dans le passé',
    'validation.startTimeRequired': 'L\'heure de début est obligatoire',
    'validation.endTimeRequired': 'L\'heure de fin est obligatoire',
    'validation.endTimeAfterStart': 'L\'heure de fin doit être après l\'heure de début',
    'validation.ticketsPositive': 'Le nombre de billets disponibles ne peut pas être négatif',
    'validation.usernameRequired': 'Le nom d\'utilisateur est obligatoire',
    'validation.passwordRequired': 'Le mot de passe est obligatoire',
    
    // Cities page
    'cities.title': 'Villes',
    'cities.subtitle': 'Explorez les lieux regroupés par ville et découvrez les événements à venir dans chaque lieu.',
    'cities.noCities': 'Aucune ville trouvée.',
    'cities.noVenues': 'Pas encore de lieux dans cette ville.',
    'cities.upcomingEvents': 'Événements à venir :',
    'cities.noEventsYet': 'Rien à voir ici pour le moment.',
    'cities.moreEvents': '+ {count} autres événements',
    'cities.capacity': 'Capacité : {count}',
    
    // Venues listing page
    'venues.title': 'Lieux',
    'venues.subtitle': 'Explorez tous les lieux à travers les villes belges. Cliquez sur un lieu pour voir son programme.',
    'venues.filterCity': 'Filtrer par ville',
    'venues.allCities': 'Toutes les villes',
    'venues.noVenues': 'Aucun lieu trouvé correspondant aux filtres.',
    'venues.eventsCount': '{count} événements à venir',

    // Venue page
    'venue.schedule': 'Programme',
    'venue.noEvents': 'Rien à voir ici pour le moment.',
    'venue.notFound': 'Lieu non trouvé',
    'venue.idMissing': 'Identifiant du lieu manquant.',
    'venue.browseCities': 'Parcourir les villes',
    'venue.backToEvents': '← Retour aux événements',
    'venue.backToCities': '← Retour aux villes',
    'venue.featuring': 'Avec : {artists}',
    'venue.city': 'Ville',
    'venue.address': 'Adresse',
    'venue.noAddress': 'Adresse non disponible',
    'venue.capacity': 'Capacité',
    
    // Login page
    'login.title': 'Connexion',
    'login.subtitle': 'Connectez-vous à votre compte pour gérer les événements et acheter des billets.',
    'login.username': 'Nom d\'utilisateur',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.submitting': 'Connexion en cours...',
    'login.error': 'Échec de la connexion. Veuillez vérifier vos identifiants.',
    'login.demoAccounts': 'Comptes de démonstration',
    'login.demoHint': 'Utilisez l\'un de ces comptes pour tester :',
    'login.noAccount': 'Vous n\'avez pas de compte ?',
    'login.registerLink': 'Inscrivez-vous ici',
    'login.role': 'Rôle',
    'login.roleUser': 'Utilisateur',
    'login.roleOrganizer': 'Organisateur',
    'login.roleAdmin': 'Admin',
    
    // Register page
    'register.title': 'Créer un compte',
    'register.subtitle': 'Inscrivez-vous pour gérer les événements et acheter des billets.',
    'register.username': 'Nom d\'utilisateur',
    'register.usernamePlaceholder': 'Choisissez un nom d\'utilisateur',
    'register.password': 'Mot de passe',
    'register.passwordPlaceholder': 'Choisissez un mot de passe',
    'register.confirmPassword': 'Confirmer le mot de passe',
    'register.confirmPasswordPlaceholder': 'Confirmez votre mot de passe',
    'register.submit': 'Créer un compte',
    'register.submitting': 'Création du compte...',
    'register.error': 'L\'inscription a échoué. Veuillez réessayer.',
    'register.haveAccount': 'Vous avez déjà un compte ?',
    'register.loginLink': 'Connectez-vous ici',
    'register.accountType': 'Type de compte',
    'register.roleUser': 'Utilisateur',
    'register.roleOrganizer': 'Organisateur',
    'register.userDesc': 'Parcourir les événements et acheter des billets',
    'register.organizerDesc': 'Créer et gérer vos propres événements',

    // Validation
    'validation.usernameMinLength': 'Le nom d\'utilisateur doit comporter au moins 3 caractères',
    'validation.passwordMinLength': 'Le mot de passe doit comporter au moins 6 caractères',
    'validation.passwordMismatch': 'Les mots de passe ne correspondent pas',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.backendError': 'Impossible de se connecter au serveur backend. Veuillez réessayer plus tard.',
    'common.required': 'obligatoire',
    'common.retry': 'Réessayer',
    'common.viewDetails': 'Voir les détails',
    'common.backToEvents': 'Retour aux événements',
    'common.browseEvents': 'Parcourir les événements',
    'common.viewAllEvents': 'Voir tous les événements',

    // Event detail page
    'eventDetail.notFound': 'Événement non trouvé',
    'eventDetail.pastEvent': 'Événement passé',
    'eventDetail.time': 'Horaire',
    'eventDetail.venue': 'Lieu',
    'eventDetail.featuredArtists': 'Artistes à l\'affiche',
    'eventDetail.tickets': 'Billets',
    'eventDetail.available': '{count} disponibles',
    'eventDetail.getTickets': 'Acheter des billets',
    'eventDetail.about': 'À propos de cet événement',
    'eventDetail.allVenues': 'Tous les lieux',

    // Home page extra
    'home.upcomingEvents': 'Événements à venir',
    'home.upcomingSubtitle': 'Ne manquez pas ce qui arrive',
    
    // Profile page
    'profile.title': 'Mon profil',
    'profile.location': 'Emplacement',
    'profile.city': 'Ville',
    'profile.eventPreference': 'Préférence événementielle',
    'profile.notSet': 'Non défini',
    'profile.preferredCity': 'Ville préférée pour la page d\'accueil',
    'profile.noPreference': 'Aucune préférence (tout afficher)',
    'profile.savePreference': 'Enregistrer la préférence',
    'profile.saving': 'Enregistrement...',
    'profile.preferencesSaved': 'Préférences enregistrées !',
    'profile.saveFailed': 'Échec de l\'enregistrement',
    
    // Home page - personalized content
    'home.eventsIn': 'Événements à',
    'home.venuesIn': 'Lieux à',
    'home.changeCity': 'Changer de ville',
    'home.noEventsInCity': 'Pas d\'événements à venir dans cette ville',
    'home.personalizeTitle': 'Personnalisez votre expérience',
    'home.personalizeDesc': 'Définissez une ville préférée pour voir les événements et lieux adaptés à vos goûts',
    'home.setPreference': 'Définir la ville préférée',
    
    // Add Venue page
    'nav.addVenue': 'Ajouter un lieu',
    'addVenue.title': 'Ajouter un nouveau lieu',
    'addVenue.subtitle': 'Créez un nouveau lieu où des événements peuvent être organisés.',
    'addVenue.nameField': 'Nom du lieu',
    'addVenue.namePlaceholder': 'Entrez le nom du lieu',
    'addVenue.city': 'Ville',
    'addVenue.address': 'Adresse',
    'addVenue.addressPlaceholder': 'Adresse (optionnel)',
    'addVenue.capacity': 'Capacité',
    'addVenue.capacityPlaceholder': 'Nombre maximum de personnes',
    'addVenue.save': 'Créer le lieu',
    'addVenue.saving': 'Création...',
    'addVenue.reset': 'Réinitialiser',
    'addVenue.success': 'Lieu "{name}" créé avec succès!',
    'addVenue.createFailed': 'Échec de la création du lieu',
    'addVenue.loginRequired': 'Vous devez être connecté pour ajouter des lieux.',
    'addVenue.noPermission': 'Vous n\'avez pas la permission d\'ajouter des lieux. Seuls les administrateurs peuvent créer des lieux.',
    'addVenue.validation.nameRequired': 'Le nom du lieu est requis',
    'addVenue.validation.nameMinLength': 'Le nom du lieu doit comporter au moins 2 caractères',
    'addVenue.validation.cityRequired': 'La ville est requise',
    'addVenue.validation.capacityPositive': 'La capacité doit être d\'au moins 1',
    
    // Footer
    'footer.copyright': '© {year} Eventify',
    'footer.tagline': 'Créé pour l\'apprentissage — UCLL Full Stack',
    
    // Language
    'language.switch': 'Langue',
    'language.en': 'English',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.cities': 'Städte',
    'nav.events': 'Veranstaltungen',
    'nav.addEvent': 'Veranstaltung hinzufügen',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    'nav.register': 'Registrieren',
    'nav.profile': 'Profil',
    'nav.venues': 'Veranstaltungsorte',
    'nav.welcome': 'Willkommen, {name}',
    
    // Home page
    'home.title': 'Entdecken Sie Veranstaltungen in Ihrer Nähe',
    'home.subtitle': 'Finden Sie Konzerte, Comedy, Filme und Community-Events in Veranstaltungsorten in belgischen Städten. Filtern, erkunden und fügen Sie Ihre eigenen Events hinzu.',
    'home.browseEvents': 'Veranstaltungen durchsuchen',
    'home.exploreCities': 'Städte erkunden',
    'home.whatYouCanDo': 'Was Sie tun können',
    'home.browseTitle': 'Kuratierte Veranstaltungen durchsuchen',
    'home.browseDesc': 'Filtern Sie nach Stadt oder Typ, um zu finden, was Ihnen gefällt.',
    'home.discoverTitle': 'Veranstaltungsorte entdecken',
    'home.discoverDesc': 'Sehen Sie Beschreibungen und kommende Programme.',
    'home.addTitle': 'Veranstaltungen hinzufügen',
    'home.addDesc': 'Teilen Sie Ihre Veranstaltung schnell mit der Community.',
    'home.badgeFree': 'Kostenlos',
    'home.badgeLocal': 'Lokal',
    'home.badgeQuick': 'Schnell',
    
    // Events page
    'events.title': 'Veranstaltungsübersicht',
    'events.subtitle': 'Durchsuchen Sie alle kommenden Veranstaltungen an verschiedenen Orten. Verwenden Sie die Filter, um die Ergebnisse einzugrenzen.',
    'events.filterCity': 'Nach Stadt filtern',
    'events.filterType': 'Nach Typ filtern',
    'events.allCities': 'Alle Städte',
    'events.allTypes': 'Alle Typen',
    'events.noEvents': 'Keine Veranstaltungen gefunden, die den Filtern entsprechen.',
    'events.loading': 'Veranstaltungen werden geladen...',
    'events.ticketsAvailable': '{count} Tickets verfügbar',
    'events.viewSchedule': 'Programm ansehen',
    'events.type': 'Typ',
    
    // Add Event page
    'addEvent.title': 'Veranstaltung hinzufügen / bearbeiten',
    'addEvent.subtitle': 'Erstellen Sie eine neue Veranstaltung und weisen Sie sie einem oder mehreren Orten zu. Veranstaltungen werden in der Datenbank gespeichert.',
    'addEvent.titleField': 'Titel',
    'addEvent.venue': 'Veranstaltungsort(e)',
    'addEvent.venueHint': '(Strg+Klick für mehrere)',
    'addEvent.date': 'Datum',
    'addEvent.type': 'Typ',
    'addEvent.typePlaceholder': 'Musik / Comedy / Film',
    'addEvent.startTime': 'Startzeit',
    'addEvent.endTime': 'Endzeit',
    'addEvent.availableTickets': 'Verfügbare Tickets',
    'addEvent.ticketsPlaceholder': 'Leer lassen für unbegrenzt',
    'addEvent.description': 'Beschreibung',
    'addEvent.descriptionPlaceholder': 'Kurze Beschreibung (optional)',
    'addEvent.save': 'Veranstaltung speichern',
    'addEvent.saving': 'Speichern...',
    'addEvent.reset': 'Zurücksetzen',
    'addEvent.success': 'Veranstaltung "{title}" erfolgreich erstellt!',
    'addEvent.validationErrors': 'Validierungsfehler:',
    'addEvent.loginRequired': 'Sie müssen angemeldet sein, um Veranstaltungen hinzuzufügen.',
    'addEvent.noPermission': 'Sie haben keine Berechtigung, Veranstaltungen hinzuzufügen. Nur Administratoren und Organisatoren können Veranstaltungen erstellen.',
    'addEvent.createFailed': 'Veranstaltung konnte nicht erstellt werden',
    
    // Validation messages
    'validation.titleRequired': 'Titel ist erforderlich',
    'validation.titleMinLength': 'Titel muss mindestens 2 Zeichen lang sein',
    'validation.venueRequired': 'Mindestens ein Veranstaltungsort muss ausgewählt werden',
    'validation.dateRequired': 'Datum ist erforderlich',
    'validation.dateNotPast': 'Veranstaltungsdatum darf nicht in der Vergangenheit liegen',
    'validation.startTimeRequired': 'Startzeit ist erforderlich',
    'validation.endTimeRequired': 'Endzeit ist erforderlich',
    'validation.endTimeAfterStart': 'Endzeit muss nach der Startzeit liegen',
    'validation.ticketsPositive': 'Verfügbare Tickets dürfen nicht negativ sein',
    'validation.usernameRequired': 'Benutzername ist erforderlich',
    'validation.passwordRequired': 'Passwort ist erforderlich',
    
    // Cities page
    'cities.title': 'Städte',
    'cities.subtitle': 'Erkunden Sie nach Städten gruppierte Veranstaltungsorte und sehen Sie kommende Veranstaltungen an jedem Ort.',
    'cities.noCities': 'Keine Städte gefunden.',
    'cities.noVenues': 'Noch keine Veranstaltungsorte in dieser Stadt.',
    'cities.upcomingEvents': 'Kommende Veranstaltungen:',
    'cities.noEventsYet': 'Hier gibt es noch nichts zu sehen.',
    'cities.moreEvents': '+ {count} weitere Veranstaltungen',
    'cities.capacity': 'Kapazität: {count}',
    
    // Venues listing page
    'venues.title': 'Veranstaltungsorte',
    'venues.subtitle': 'Entdecken Sie alle Veranstaltungsorte in belgischen Städten. Klicken Sie auf einen Ort, um das Programm zu sehen.',
    'venues.filterCity': 'Nach Stadt filtern',
    'venues.allCities': 'Alle Städte',
    'venues.noVenues': 'Keine Veranstaltungsorte gefunden.',
    'venues.eventsCount': '{count} kommende Veranstaltungen',

    // Venue page
    'venue.schedule': 'Programm',
    'venue.noEvents': 'Hier gibt es noch nichts zu sehen.',
    'venue.notFound': 'Veranstaltungsort nicht gefunden',
    'venue.idMissing': 'Veranstaltungsort-ID fehlt.',
    'venue.browseCities': 'Städte durchsuchen',
    'venue.backToEvents': '← Zurück zu Veranstaltungen',
    'venue.backToCities': '← Zurück zu Städten',
    'venue.featuring': 'Mit dabei: {artists}',
    'venue.city': 'Stadt',
    'venue.address': 'Adresse',
    'venue.noAddress': 'Keine Adresse verfügbar',
    'venue.capacity': 'Kapazität',
    
    // Login page
    'login.title': 'Anmelden',
    'login.subtitle': 'Melden Sie sich bei Ihrem Konto an, um Veranstaltungen zu verwalten und Tickets zu kaufen.',
    'login.username': 'Benutzername',
    'login.password': 'Passwort',
    'login.submit': 'Anmelden',
    'login.submitting': 'Anmeldung läuft...',
    'login.error': 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.',
    'login.demoAccounts': 'Demo-Konten',
    'login.demoHint': 'Verwenden Sie eines dieser Konten zum Testen:',
    'login.noAccount': 'Noch kein Konto?',
    'login.registerLink': 'Hier registrieren',
    'login.role': 'Rolle',
    'login.roleUser': 'Benutzer',
    'login.roleOrganizer': 'Organisator',
    'login.roleAdmin': 'Admin',
    
    // Register page
    'register.title': 'Konto erstellen',
    'register.subtitle': 'Registrieren Sie sich, um Veranstaltungen zu verwalten und Tickets zu kaufen.',
    'register.username': 'Benutzername',
    'register.usernamePlaceholder': 'Wählen Sie einen Benutzernamen',
    'register.password': 'Passwort',
    'register.passwordPlaceholder': 'Wählen Sie ein Passwort',
    'register.confirmPassword': 'Passwort bestätigen',
    'register.confirmPasswordPlaceholder': 'Bestätigen Sie Ihr Passwort',
    'register.submit': 'Konto erstellen',
    'register.submitting': 'Konto wird erstellt...',
    'register.error': 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    'register.haveAccount': 'Haben Sie bereits ein Konto?',
    'register.loginLink': 'Hier anmelden',
    'register.accountType': 'Kontotyp',
    'register.roleUser': 'Benutzer',
    'register.roleOrganizer': 'Organisator',
    'register.userDesc': 'Veranstaltungen durchsuchen und Tickets kaufen',
    'register.organizerDesc': 'Eigene Veranstaltungen erstellen und verwalten',

    // Validation
    'validation.usernameMinLength': 'Benutzername muss mindestens 3 Zeichen lang sein',
    'validation.passwordMinLength': 'Passwort muss mindestens 6 Zeichen lang sein',
    'validation.passwordMismatch': 'Passwörter stimmen nicht überein',

    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.backendError': 'Verbindung zum Backend-Server nicht möglich. Bitte versuchen Sie es später erneut.',
    'common.required': 'erforderlich',
    'common.retry': 'Erneut versuchen',
    'common.viewDetails': 'Details ansehen',
    'common.backToEvents': 'Zurück zu Veranstaltungen',
    'common.browseEvents': 'Veranstaltungen durchsuchen',
    'common.viewAllEvents': 'Alle Veranstaltungen',

    // Event detail page
    'eventDetail.notFound': 'Veranstaltung nicht gefunden',
    'eventDetail.pastEvent': 'Vergangene Veranstaltung',
    'eventDetail.time': 'Uhrzeit',
    'eventDetail.venue': 'Veranstaltungsort',
    'eventDetail.featuredArtists': 'Auftretende Künstler',
    'eventDetail.tickets': 'Tickets',
    'eventDetail.available': '{count} verfügbar',
    'eventDetail.getTickets': 'Tickets kaufen',
    'eventDetail.about': 'Über diese Veranstaltung',
    'eventDetail.allVenues': 'Alle Veranstaltungsorte',

    // Home page extra
    'home.upcomingEvents': 'Kommende Veranstaltungen',
    'home.upcomingSubtitle': 'Verpassen Sie nicht, was als Nächstes kommt',
    
    // Profile page
    'profile.title': 'Mein Profil',
    'profile.location': 'Standort',
    'profile.city': 'Stadt',
    'profile.eventPreference': 'Veranstaltungspräferenz',
    'profile.notSet': 'Nicht festgelegt',
    'profile.preferredCity': 'Bevorzugte Stadt für die Startseite',
    'profile.noPreference': 'Keine Präferenz (alle anzeigen)',
    'profile.savePreference': 'Präferenz speichern',
    'profile.saving': 'Speichern...',
    'profile.preferencesSaved': 'Präferenzen gespeichert!',
    'profile.saveFailed': 'Speichern fehlgeschlagen',
    
    // Home page - personalized content
    'home.eventsIn': 'Veranstaltungen in',
    'home.venuesIn': 'Veranstaltungsorte in',
    'home.changeCity': 'Stadt ändern',
    'home.noEventsInCity': 'Keine kommenden Veranstaltungen in dieser Stadt',
    'home.personalizeTitle': 'Personalisieren Sie Ihre Erfahrung',
    'home.personalizeDesc': 'Legen Sie eine bevorzugte Stadt fest, um auf Sie zugeschnittene Veranstaltungen und Orte zu sehen',
    'home.setPreference': 'Bevorzugte Stadt festlegen',
    
    // Add Venue page
    'nav.addVenue': 'Veranstaltungsort hinzufügen',
    'addVenue.title': 'Neuen Veranstaltungsort hinzufügen',
    'addVenue.subtitle': 'Erstellen Sie einen neuen Veranstaltungsort, an dem Events stattfinden können.',
    'addVenue.nameField': 'Name des Ortes',
    'addVenue.namePlaceholder': 'Name des Veranstaltungsorts eingeben',
    'addVenue.city': 'Stadt',
    'addVenue.address': 'Adresse',
    'addVenue.addressPlaceholder': 'Straßenadresse (optional)',
    'addVenue.capacity': 'Kapazität',
    'addVenue.capacityPlaceholder': 'Maximale Anzahl an Gästen',
    'addVenue.save': 'Veranstaltungsort erstellen',
    'addVenue.saving': 'Erstellen...',
    'addVenue.reset': 'Zurücksetzen',
    'addVenue.success': 'Veranstaltungsort "{name}" erfolgreich erstellt!',
    'addVenue.createFailed': 'Fehler beim Erstellen des Veranstaltungsorts',
    'addVenue.loginRequired': 'Sie müssen angemeldet sein, um Veranstaltungsorte hinzuzufügen.',
    'addVenue.noPermission': 'Sie haben keine Berechtigung, Veranstaltungsorte hinzuzufügen. Nur Administratoren können Veranstaltungsorte erstellen.',
    'addVenue.validation.nameRequired': 'Name des Veranstaltungsorts ist erforderlich',
    'addVenue.validation.nameMinLength': 'Name des Veranstaltungsorts muss mindestens 2 Zeichen lang sein',
    'addVenue.validation.cityRequired': 'Stadt ist erforderlich',
    'addVenue.validation.capacityPositive': 'Kapazität muss mindestens 1 sein',
    
    // Footer
    'footer.copyright': '© {year} Eventify',
    'footer.tagline': 'Erstellt zum Lernen — UCLL Full Stack',
    
    // Language
    'language.switch': 'Sprache',
    'language.en': 'English',
    'language.fr': 'Français',
    'language.de': 'Deutsch',
  },
};

// ============================
// Context
// ============================

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'eventify_locale';

// ============================
// Provider
// ============================

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load locale from browser storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'en' || stored === 'fr' || stored === 'de')) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LANG_STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = translations[locale][key] || translations['en'][key] || key;
    
    // Replace parameters like {name} with actual values
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  }, [locale]);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
    availableLocales,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ============================
// Hook
// ============================

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

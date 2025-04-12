# Cardy - Flashcard Learning App

A React Native mobile application for creating and studying flashcards with spaced repetition learning.

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. Clone the repository
2. Navigate to the app directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add a new Web app to your Firebase project
3. Enable Authentication, Firestore, Storage, and Functions services in your Firebase project
4. Copy the Firebase configuration from your project settings
5. Create a `.env` file in the root directory (copy from `.env.example`)
6. Fill in your Firebase configuration values in the `.env` file

### Running the App

```bash
npm start
```

Then follow the instructions to open the app on your device or emulator.

## Project Structure

```
app/
├── src/
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable UI components
│   ├── constants/      # App constants and configuration
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   ├── services/       # API and service integrations
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .env.example        # Environment variables template
├── App.tsx             # Main app component
└── package.json        # Dependencies and scripts
```

## Features

- User authentication
- Create and manage flashcard decks
- Study flashcards with spaced repetition
- Track study progress
- Share decks with other users
- Premium subscription features

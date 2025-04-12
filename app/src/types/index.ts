/**
 * Type definitions for the Cardy application
 */

// User related types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isPremium: boolean;
  
  // Sun Card data
  sunCard?: {
    name: string;
    sign: string;
    element: string;
    description: string;
    traits: string[];
    compatibility: string[];
  };
}

// Flashcard related types
export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date | string;
  nextReviewDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Deck related types
export interface Deck {
  id: string;
  userId: string;
  title: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  cardCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Study session related types
export interface StudySession {
  id: string;
  userId: string;
  deckId: string;
  startTime: Date | string;
  endTime?: Date | string;
  cardsStudied: number;
  correctAnswers: number;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

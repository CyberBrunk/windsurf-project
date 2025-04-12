import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck, Flashcard, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const STORAGE_KEYS = {
  DECKS: 'cardy_decks',
  FLASHCARDS: 'cardy_flashcards',
  USER_STATS: 'cardy_user_stats',
  STUDY_SESSIONS: 'cardy_study_sessions',
};

// User stats interface
interface UserStats {
  userId: string;
  totalCards: number;
  cardsLearned: number;
  streak: number;
  lastStudyDate: string | null;
  accuracy: number;
}

// Study session interface
interface StudySession {
  id: string;
  userId: string;
  deckId: string;
  date: string;
  cardsStudied: number;
  correctAnswers: number;
  duration: number; // in seconds
}

/**
 * Initialize local storage with sample data
 */
export const initializeLocalStorage = async (userId: string): Promise<void> => {
  try {
    // Check if data already exists
    const decksData = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    
    if (!decksData) {
      // Create sample decks
      const sampleDecks: Deck[] = [
        {
          id: uuidv4(),
          userId,
          title: 'Daily Affirmations',
          description: 'Positive affirmations to start your day',
          tags: ['personal', 'growth'],
          isPublic: false,
          cardCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          userId,
          title: 'Zodiac Signs',
          description: 'Learn about the 12 zodiac signs and their traits',
          tags: ['astrology', 'learning'],
          isPublic: true,
          cardCount: 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(sampleDecks));
      
      // Create sample flashcards for the decks
      const sampleFlashcards: Flashcard[] = [
        // Daily Affirmations
        {
          id: uuidv4(),
          deckId: sampleDecks[0].id,
          front: 'I am capable',
          back: 'I have the skills and abilities to achieve my goals',
          difficulty: 'easy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          deckId: sampleDecks[0].id,
          front: 'I am worthy',
          back: 'I deserve love, respect, and good things in my life',
          difficulty: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          deckId: sampleDecks[0].id,
          front: 'I am resilient',
          back: 'I can overcome any challenge that comes my way',
          difficulty: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          deckId: sampleDecks[0].id,
          front: 'I am grateful',
          back: 'I appreciate the abundance in my life',
          difficulty: 'easy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          deckId: sampleDecks[0].id,
          front: 'I am present',
          back: 'I focus on the here and now, not the past or future',
          difficulty: 'hard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        
        // Zodiac Signs (just a few examples)
        {
          id: uuidv4(),
          deckId: sampleDecks[1].id,
          front: 'Aries (March 21 - April 19)',
          back: 'Fire sign. Traits: Bold, ambitious, impulsive, passionate',
          difficulty: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          deckId: sampleDecks[1].id,
          front: 'Taurus (April 20 - May 20)',
          back: 'Earth sign. Traits: Reliable, patient, practical, devoted',
          difficulty: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          deckId: sampleDecks[1].id,
          front: 'Gemini (May 21 - June 20)',
          back: 'Air sign. Traits: Curious, adaptable, communicative, witty',
          difficulty: 'easy',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      await AsyncStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(sampleFlashcards));
      
      // Initialize user stats
      const userStats: UserStats = {
        userId,
        totalCards: sampleFlashcards.length,
        cardsLearned: 3,
        streak: 1,
        lastStudyDate: new Date().toISOString(),
        accuracy: 85,
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(userStats));
      
      // Initialize study sessions
      const studySessions: StudySession[] = [
        {
          id: uuidv4(),
          userId,
          deckId: sampleDecks[0].id,
          date: new Date().toISOString(),
          cardsStudied: 5,
          correctAnswers: 4,
          duration: 180,
        },
      ];
      
      await AsyncStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(studySessions));
    }
  } catch (error) {
    console.error('Error initializing local storage:', error);
  }
};

/**
 * Get all decks for a user
 */
export const getUserDecks = async (userId: string): Promise<Deck[]> => {
  try {
    const decksData = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    
    if (decksData) {
      const decks: Deck[] = JSON.parse(decksData);
      return decks.filter(deck => deck.userId === userId);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user decks:', error);
    return [];
  }
};

/**
 * Get a deck by ID
 */
export const getDeckById = async (deckId: string): Promise<Deck | null> => {
  try {
    const decksData = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    
    if (decksData) {
      const decks: Deck[] = JSON.parse(decksData);
      return decks.find(deck => deck.id === deckId) || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting deck by ID:', error);
    return null;
  }
};

/**
 * Create a new deck
 */
export const createDeck = async (userId: string, deckData: Partial<Deck>): Promise<string> => {
  try {
    const decksData = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    let decks: Deck[] = [];
    
    if (decksData) {
      decks = JSON.parse(decksData);
    }
    
    const newDeck: Deck = {
      id: uuidv4(),
      userId,
      title: deckData.title || 'Untitled Deck',
      description: deckData.description || '',
      tags: deckData.tags || [],
      isPublic: deckData.isPublic || false,
      cardCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    decks.push(newDeck);
    await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
    
    return newDeck.id;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
};

/**
 * Get all flashcards for a deck
 */
export const getDeckFlashcards = async (deckId: string): Promise<Flashcard[]> => {
  try {
    const flashcardsData = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    
    if (flashcardsData) {
      const flashcards: Flashcard[] = JSON.parse(flashcardsData);
      return flashcards.filter(card => card.deckId === deckId);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting deck flashcards:', error);
    return [];
  }
};

/**
 * Create a new flashcard
 */
export const createFlashcard = async (
  deckId: string, 
  flashcardData: Partial<Flashcard>
): Promise<string> => {
  try {
    const flashcardsData = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    let flashcards: Flashcard[] = [];
    
    if (flashcardsData) {
      flashcards = JSON.parse(flashcardsData);
    }
    
    const newFlashcard: Flashcard = {
      id: uuidv4(),
      deckId,
      front: flashcardData.front || '',
      back: flashcardData.back || '',
      difficulty: flashcardData.difficulty || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    flashcards.push(newFlashcard);
    await AsyncStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
    
    // Update deck card count
    await updateDeckCardCount(deckId);
    
    return newFlashcard.id;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

/**
 * Update deck card count
 */
export const updateDeckCardCount = async (deckId: string): Promise<void> => {
  try {
    const flashcardsData = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    const decksData = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    
    if (flashcardsData && decksData) {
      const flashcards: Flashcard[] = JSON.parse(flashcardsData);
      const decks: Deck[] = JSON.parse(decksData);
      
      const deckFlashcards = flashcards.filter(card => card.deckId === deckId);
      const deckIndex = decks.findIndex(deck => deck.id === deckId);
      
      if (deckIndex !== -1) {
        decks[deckIndex].cardCount = deckFlashcards.length;
        decks[deckIndex].updatedAt = new Date().toISOString();
        
        await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
      }
    }
  } catch (error) {
    console.error('Error updating deck card count:', error);
  }
};

/**
 * Get user stats
 */
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const statsData = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    
    if (statsData) {
      const stats: UserStats = JSON.parse(statsData);
      if (stats.userId === userId) {
        return stats;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
};

/**
 * Update user stats
 */
export const updateUserStats = async (userId: string, statsData: Partial<UserStats>): Promise<void> => {
  try {
    const statsDataStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    let stats: UserStats;
    
    if (statsDataStr) {
      stats = JSON.parse(statsDataStr);
      stats = { ...stats, ...statsData, userId };
    } else {
      stats = {
        userId,
        totalCards: statsData.totalCards || 0,
        cardsLearned: statsData.cardsLearned || 0,
        streak: statsData.streak || 0,
        lastStudyDate: statsData.lastStudyDate || null,
        accuracy: statsData.accuracy || 0,
      };
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

/**
 * Get due flashcards for today
 */
export const getDueFlashcards = async (userId: string, limit = 10): Promise<Flashcard[]> => {
  try {
    const flashcardsData = await AsyncStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    const decksData = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    
    if (flashcardsData && decksData) {
      const flashcards: Flashcard[] = JSON.parse(flashcardsData);
      const decks: Deck[] = JSON.parse(decksData);
      
      // Get user's deck IDs
      const userDeckIds = decks
        .filter(deck => deck.userId === userId)
        .map(deck => deck.id);
      
      // Get flashcards from user's decks
      const userFlashcards = flashcards.filter(card => 
        userDeckIds.includes(card.deckId)
      );
      
      // For simplicity, just return some cards
      // In a real app, we would implement spaced repetition logic here
      return userFlashcards.slice(0, limit);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    return [];
  }
};

/**
 * Record a study session
 */
export const recordStudySession = async (
  userId: string,
  deckId: string,
  cardsStudied: number,
  correctAnswers: number,
  duration: number
): Promise<void> => {
  try {
    const sessionsData = await AsyncStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
    let sessions: StudySession[] = [];
    
    if (sessionsData) {
      sessions = JSON.parse(sessionsData);
    }
    
    const newSession: StudySession = {
      id: uuidv4(),
      userId,
      deckId,
      date: new Date().toISOString(),
      cardsStudied,
      correctAnswers,
      duration,
    };
    
    sessions.push(newSession);
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(sessions));
    
    // Update user stats
    const statsData = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    let stats: UserStats;
    
    if (statsData) {
      stats = JSON.parse(statsData);
      
      // Update streak
      const lastDate = stats.lastStudyDate ? new Date(stats.lastStudyDate) : null;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate) {
        const lastDateStr = lastDate.toDateString();
        const yesterdayStr = yesterday.toDateString();
        const todayStr = today.toDateString();
        
        if (lastDateStr === yesterdayStr) {
          // Studied yesterday, increment streak
          stats.streak += 1;
        } else if (lastDateStr !== todayStr) {
          // Didn't study yesterday or today yet, reset streak
          stats.streak = 1;
        }
      } else {
        // First time studying
        stats.streak = 1;
      }
      
      // Update other stats
      stats.lastStudyDate = today.toISOString();
      stats.cardsLearned += cardsStudied;
      
      // Calculate new accuracy
      const totalAnswers = stats.accuracy * stats.totalCards;
      const newTotalAnswers = totalAnswers + cardsStudied;
      const newCorrectAnswers = totalAnswers * (stats.accuracy / 100) + correctAnswers;
      stats.accuracy = Math.round((newCorrectAnswers / newTotalAnswers) * 100);
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    }
  } catch (error) {
    console.error('Error recording study session:', error);
  }
};

export default {
  initializeLocalStorage,
  getUserDecks,
  getDeckById,
  createDeck,
  getDeckFlashcards,
  createFlashcard,
  getUserStats,
  updateUserStats,
  getDueFlashcards,
  recordStudySession,
};

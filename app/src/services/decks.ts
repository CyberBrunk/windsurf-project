import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Deck } from '../types';

const DECKS_COLLECTION = 'decks';

/**
 * Create a new deck
 */
export const createDeck = async (userId: string, deckData: Partial<Deck>): Promise<string> => {
  try {
    const decksRef = collection(db, DECKS_COLLECTION);
    
    const newDeck = {
      userId,
      title: deckData.title || 'Untitled Deck',
      description: deckData.description || '',
      tags: deckData.tags || [],
      isPublic: deckData.isPublic || false,
      cardCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(decksRef, newDeck);
    return docRef.id;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
};

/**
 * Get a deck by ID
 */
export const getDeckById = async (deckId: string): Promise<Deck | null> => {
  try {
    const deckRef = doc(db, DECKS_COLLECTION, deckId);
    const deckSnap = await getDoc(deckRef);
    
    if (deckSnap.exists()) {
      const data = deckSnap.data();
      return {
        id: deckSnap.id,
        userId: data.userId,
        title: data.title,
        description: data.description || '',
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        cardCount: data.cardCount || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting deck:', error);
    throw error;
  }
};

/**
 * Get all decks for a user
 */
export const getUserDecks = async (userId: string): Promise<Deck[]> => {
  try {
    const decksRef = collection(db, DECKS_COLLECTION);
    const q = query(
      decksRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const decks: Deck[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      decks.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description || '',
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        cardCount: data.cardCount || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    
    return decks;
  } catch (error) {
    console.error('Error getting user decks:', error);
    throw error;
  }
};

/**
 * Update a deck
 */
export const updateDeck = async (deckId: string, deckData: Partial<Deck>): Promise<void> => {
  try {
    const deckRef = doc(db, DECKS_COLLECTION, deckId);
    
    const updateData = {
      ...deckData,
      updatedAt: serverTimestamp(),
    };
    
    // Remove id and userId from update data
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;
    
    await updateDoc(deckRef, updateData);
  } catch (error) {
    console.error('Error updating deck:', error);
    throw error;
  }
};

/**
 * Delete a deck
 */
export const deleteDeck = async (deckId: string): Promise<void> => {
  try {
    const deckRef = doc(db, DECKS_COLLECTION, deckId);
    await deleteDoc(deckRef);
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
};

/**
 * Get public decks
 */
export const getPublicDecks = async (limitCount = 10): Promise<Deck[]> => {
  try {
    const decksRef = collection(db, DECKS_COLLECTION);
    const q = query(
      decksRef, 
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const decks: Deck[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      decks.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description || '',
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        cardCount: data.cardCount || 0,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    
    return decks;
  } catch (error) {
    console.error('Error getting public decks:', error);
    throw error;
  }
};

/**
 * Update deck card count
 */
export const updateDeckCardCount = async (deckId: string, count: number): Promise<void> => {
  try {
    const deckRef = doc(db, DECKS_COLLECTION, deckId);
    await updateDoc(deckRef, {
      cardCount: count,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating deck card count:', error);
    throw error;
  }
};

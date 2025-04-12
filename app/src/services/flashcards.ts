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
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { Flashcard } from '../types';
import { updateDeckCardCount } from './decks';

const FLASHCARDS_COLLECTION = 'flashcards';

/**
 * Create a new flashcard
 */
export const createFlashcard = async (
  deckId: string, 
  flashcardData: Partial<Flashcard>
): Promise<string> => {
  try {
    const flashcardsRef = collection(db, FLASHCARDS_COLLECTION);
    
    const newFlashcard = {
      deckId,
      front: flashcardData.front || '',
      back: flashcardData.back || '',
      difficulty: flashcardData.difficulty || 'medium',
      lastReviewed: null,
      nextReviewDate: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(flashcardsRef, newFlashcard);
    
    // Update deck card count
    const deckCardsQuery = query(
      collection(db, FLASHCARDS_COLLECTION),
      where('deckId', '==', deckId)
    );
    const snapshot = await getDocs(deckCardsQuery);
    await updateDeckCardCount(deckId, snapshot.size);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

/**
 * Get a flashcard by ID
 */
export const getFlashcardById = async (flashcardId: string): Promise<Flashcard | null> => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, flashcardId);
    const flashcardSnap = await getDoc(flashcardRef);
    
    if (flashcardSnap.exists()) {
      const data = flashcardSnap.data();
      return {
        id: flashcardSnap.id,
        deckId: data.deckId,
        front: data.front,
        back: data.back,
        difficulty: data.difficulty || 'medium',
        lastReviewed: data.lastReviewed?.toDate?.() || undefined,
        nextReviewDate: data.nextReviewDate?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting flashcard:', error);
    throw error;
  }
};

/**
 * Get all flashcards for a deck
 */
export const getDeckFlashcards = async (deckId: string): Promise<Flashcard[]> => {
  try {
    const flashcardsRef = collection(db, FLASHCARDS_COLLECTION);
    const q = query(
      flashcardsRef, 
      where('deckId', '==', deckId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const flashcards: Flashcard[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      flashcards.push({
        id: doc.id,
        deckId: data.deckId,
        front: data.front,
        back: data.back,
        difficulty: data.difficulty || 'medium',
        lastReviewed: data.lastReviewed?.toDate?.() || undefined,
        nextReviewDate: data.nextReviewDate?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    
    return flashcards;
  } catch (error) {
    console.error('Error getting deck flashcards:', error);
    throw error;
  }
};

/**
 * Update a flashcard
 */
export const updateFlashcard = async (
  flashcardId: string, 
  flashcardData: Partial<Flashcard>
): Promise<void> => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, flashcardId);
    
    const updateData = {
      ...flashcardData,
      updatedAt: serverTimestamp(),
    };
    
    // Remove id and deckId from update data
    delete updateData.id;
    delete updateData.deckId;
    delete updateData.createdAt;
    
    // Convert Date objects to Firestore Timestamps
    if (updateData.lastReviewed) {
      // Cast to any to avoid TypeScript errors with Timestamp
      (updateData as any).lastReviewed = Timestamp.fromDate(new Date(updateData.lastReviewed));
    }
    
    if (updateData.nextReviewDate) {
      // Cast to any to avoid TypeScript errors with Timestamp
      (updateData as any).nextReviewDate = Timestamp.fromDate(new Date(updateData.nextReviewDate));
    }
    
    await updateDoc(flashcardRef, updateData);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
};

/**
 * Delete a flashcard
 */
export const deleteFlashcard = async (flashcardId: string, deckId: string): Promise<void> => {
  try {
    const flashcardRef = doc(db, FLASHCARDS_COLLECTION, flashcardId);
    await deleteDoc(flashcardRef);
    
    // Update deck card count
    const deckCardsQuery = query(
      collection(db, FLASHCARDS_COLLECTION),
      where('deckId', '==', deckId)
    );
    const snapshot = await getDocs(deckCardsQuery);
    await updateDeckCardCount(deckId, snapshot.size);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
};

/**
 * Get flashcards due for review
 */
export const getDueFlashcards = async (deckId: string, limitCount = 20): Promise<Flashcard[]> => {
  try {
    const now = new Date();
    const flashcardsRef = collection(db, FLASHCARDS_COLLECTION);
    
    // Get cards that have never been reviewed
    const neverReviewedQuery = query(
      flashcardsRef,
      where('deckId', '==', deckId),
      where('lastReviewed', '==', null),
      limit(limitCount)
    );
    
    const neverReviewedSnapshot = await getDocs(neverReviewedQuery);
    const flashcards: Flashcard[] = [];
    
    neverReviewedSnapshot.forEach((doc) => {
      const data = doc.data();
      flashcards.push({
        id: doc.id,
        deckId: data.deckId,
        front: data.front,
        back: data.back,
        difficulty: data.difficulty || 'medium',
        lastReviewed: data.lastReviewed?.toDate?.() || undefined,
        nextReviewDate: data.nextReviewDate?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    
    // If we have enough cards, return them
    if (flashcards.length >= limitCount) {
      return flashcards.slice(0, limitCount);
    }
    
    // Otherwise, get cards due for review
    const dueQuery = query(
      flashcardsRef,
      where('deckId', '==', deckId),
      where('nextReviewDate', '<=', now),
      where('lastReviewed', '!=', null),
      limit(limitCount - flashcards.length)
    );
    
    const dueSnapshot = await getDocs(dueQuery);
    
    dueSnapshot.forEach((doc) => {
      const data = doc.data();
      flashcards.push({
        id: doc.id,
        deckId: data.deckId,
        front: data.front,
        back: data.back,
        difficulty: data.difficulty || 'medium',
        lastReviewed: data.lastReviewed?.toDate?.() || undefined,
        nextReviewDate: data.nextReviewDate?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    
    return flashcards;
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    throw error;
  }
};

/**
 * Update flashcard review status
 */
export const updateFlashcardReview = async (
  flashcardId: string,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<void> => {
  try {
    const now = new Date();
    let nextReviewDate: Date;
    
    // Calculate next review date based on difficulty
    switch (difficulty) {
      case 'easy':
        // Review in 7 days
        nextReviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'medium':
        // Review in 3 days
        nextReviewDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        break;
      case 'hard':
        // Review in 1 day
        nextReviewDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        break;
      default:
        nextReviewDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
    
    await updateFlashcard(flashcardId, {
      difficulty,
      lastReviewed: now,
      nextReviewDate,
    });
  } catch (error) {
    console.error('Error updating flashcard review:', error);
    throw error;
  }
};

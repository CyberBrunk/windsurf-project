import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
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
import { StudySession } from '../types';

const STUDY_SESSIONS_COLLECTION = 'studySessions';

/**
 * Start a new study session
 */
export const startStudySession = async (
  userId: string, 
  deckId: string
): Promise<string> => {
  try {
    const sessionsRef = collection(db, STUDY_SESSIONS_COLLECTION);
    
    const newSession = {
      userId,
      deckId,
      startTime: serverTimestamp(),
      endTime: null,
      cardsStudied: 0,
      correctAnswers: 0,
    };
    
    const docRef = await addDoc(sessionsRef, newSession);
    return docRef.id;
  } catch (error) {
    console.error('Error starting study session:', error);
    throw error;
  }
};

/**
 * End a study session
 */
export const endStudySession = async (
  sessionId: string, 
  cardsStudied: number, 
  correctAnswers: number
): Promise<void> => {
  try {
    const sessionRef = doc(db, STUDY_SESSIONS_COLLECTION, sessionId);
    
    await updateDoc(sessionRef, {
      endTime: serverTimestamp(),
      cardsStudied,
      correctAnswers,
    });
  } catch (error) {
    console.error('Error ending study session:', error);
    throw error;
  }
};

/**
 * Get a study session by ID
 */
export const getStudySessionById = async (sessionId: string): Promise<StudySession | null> => {
  try {
    const sessionRef = doc(db, STUDY_SESSIONS_COLLECTION, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();
      return {
        id: sessionSnap.id,
        userId: data.userId,
        deckId: data.deckId,
        startTime: data.startTime?.toDate?.() || new Date(),
        endTime: data.endTime?.toDate?.() || undefined,
        cardsStudied: data.cardsStudied || 0,
        correctAnswers: data.correctAnswers || 0,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting study session:', error);
    throw error;
  }
};

/**
 * Get user study sessions
 */
export const getUserStudySessions = async (
  userId: string, 
  limitCount = 10
): Promise<StudySession[]> => {
  try {
    const sessionsRef = collection(db, STUDY_SESSIONS_COLLECTION);
    const q = query(
      sessionsRef, 
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions: StudySession[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        userId: data.userId,
        deckId: data.deckId,
        startTime: data.startTime?.toDate?.() || new Date(),
        endTime: data.endTime?.toDate?.() || undefined,
        cardsStudied: data.cardsStudied || 0,
        correctAnswers: data.correctAnswers || 0,
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error getting user study sessions:', error);
    throw error;
  }
};

/**
 * Get deck study sessions
 */
export const getDeckStudySessions = async (
  deckId: string, 
  limitCount = 10
): Promise<StudySession[]> => {
  try {
    const sessionsRef = collection(db, STUDY_SESSIONS_COLLECTION);
    const q = query(
      sessionsRef, 
      where('deckId', '==', deckId),
      orderBy('startTime', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions: StudySession[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        userId: data.userId,
        deckId: data.deckId,
        startTime: data.startTime?.toDate?.() || new Date(),
        endTime: data.endTime?.toDate?.() || undefined,
        cardsStudied: data.cardsStudied || 0,
        correctAnswers: data.correctAnswers || 0,
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error getting deck study sessions:', error);
    throw error;
  }
};

/**
 * Get user's study statistics
 */
export const getUserStudyStats = async (userId: string) => {
  try {
    const sessionsRef = collection(db, STUDY_SESSIONS_COLLECTION);
    const q = query(
      sessionsRef, 
      where('userId', '==', userId),
      where('endTime', '!=', null)
    );
    
    const querySnapshot = await getDocs(q);
    let totalSessions = 0;
    let totalCardsStudied = 0;
    let totalCorrectAnswers = 0;
    let totalStudyTime = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalSessions++;
      totalCardsStudied += data.cardsStudied || 0;
      totalCorrectAnswers += data.correctAnswers || 0;
      
      if (data.startTime && data.endTime) {
        const startTime = data.startTime.toDate();
        const endTime = data.endTime.toDate();
        totalStudyTime += (endTime.getTime() - startTime.getTime()) / 1000 / 60; // in minutes
      }
    });
    
    return {
      totalSessions,
      totalCardsStudied,
      totalCorrectAnswers,
      accuracy: totalCardsStudied > 0 ? (totalCorrectAnswers / totalCardsStudied) * 100 : 0,
      averageSessionTime: totalSessions > 0 ? totalStudyTime / totalSessions : 0,
      totalStudyTime,
    };
  } catch (error) {
    console.error('Error getting user study stats:', error);
    throw error;
  }
};

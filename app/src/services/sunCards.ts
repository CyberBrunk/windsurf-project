import { Timestamp } from 'firebase/firestore';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Sun Card data type
 */
export interface SunCard {
  id: string;
  name: string;
  description: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  zodiacSign: string;
  imageUrl?: string;
}

/**
 * Get zodiac sign based on date of birth
 * @param dateOfBirth Date of birth
 * @returns Zodiac sign
 */
export const getZodiacSign = (dateOfBirth: Date): string => {
  const month = dateOfBirth.getMonth() + 1; // JavaScript months are 0-indexed
  const day = dateOfBirth.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'Aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'Taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'Gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'Cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'Leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'Virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'Libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'Scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'Sagittarius';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'Capricorn';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'Aquarius';
  } else {
    return 'Pisces';
  }
};

/**
 * Get element based on zodiac sign
 * @param zodiacSign Zodiac sign
 * @returns Element (fire, earth, air, water)
 */
export const getElement = (zodiacSign: string): 'fire' | 'earth' | 'air' | 'water' => {
  const fireElements = ['Aries', 'Leo', 'Sagittarius'];
  const earthElements = ['Taurus', 'Virgo', 'Capricorn'];
  const airElements = ['Gemini', 'Libra', 'Aquarius'];
  const waterElements = ['Cancer', 'Scorpio', 'Pisces'];

  if (fireElements.includes(zodiacSign)) {
    return 'fire';
  } else if (earthElements.includes(zodiacSign)) {
    return 'earth';
  } else if (airElements.includes(zodiacSign)) {
    return 'air';
  } else {
    return 'water';
  }
};

/**
 * Get description based on zodiac sign
 * @param zodiacSign Zodiac sign
 * @returns Description
 */
export const getDescription = (zodiacSign: string): string => {
  const descriptions: Record<string, string> = {
    'Aries': 'Aries is a fire sign known for being passionate, motivated, and confident. As natural leaders, they are independent and demonstrate strength and courage.',
    'Taurus': 'Taurus is an earth sign known for being reliable, practical, and devoted. They have an eye for beauty and enjoy the pleasures of life.',
    'Gemini': 'Gemini is an air sign known for being gentle, affectionate, and curious. They are adaptable and quick-witted, with a love for learning and sharing ideas.',
    'Cancer': 'Cancer is a water sign known for being intuitive, emotional, and nurturing. They are deeply connected to home and family, with a strong sense of empathy.',
    'Leo': 'Leo is a fire sign known for being creative, passionate, and generous. They have a natural flair for drama and love being in the spotlight.',
    'Virgo': 'Virgo is an earth sign known for being practical, analytical, and hardworking. They have a deep sense of humanity and a methodical approach to life.',
    'Libra': 'Libra is an air sign known for being balanced, diplomatic, and social. They have a strong sense of justice and enjoy harmonious relationships.',
    'Scorpio': 'Scorpio is a water sign known for being passionate, stubborn, and resourceful. They are determined and decisive, with a mysterious aura.',
    'Sagittarius': 'Sagittarius is a fire sign known for being extroverted, optimistic, and enthusiastic. They have a love for freedom and philosophical pursuits.',
    'Capricorn': 'Capricorn is an earth sign known for being responsible, disciplined, and self-controlled. They are masters of time management and practical planning.',
    'Aquarius': 'Aquarius is an air sign known for being progressive, original, and independent. They are deep thinkers with a strong humanitarian streak.',
    'Pisces': 'Pisces is a water sign known for being intuitive, artistic, and compassionate. They are deeply empathetic and have a strong connection to their inner world.'
  };

  return descriptions[zodiacSign] || 'No description available';
};

/**
 * Generate Sun Card based on date of birth
 * @param dateOfBirth Date of birth
 * @returns Sun Card
 */
export const generateSunCard = (dateOfBirth: Date): SunCard => {
  const zodiacSign = getZodiacSign(dateOfBirth);
  const element = getElement(zodiacSign);
  const description = getDescription(zodiacSign);

  return {
    id: `sun-${zodiacSign.toLowerCase()}`,
    name: `${zodiacSign} Sun`,
    description,
    element,
    zodiacSign,
    imageUrl: `/assets/images/sun-cards/${zodiacSign.toLowerCase()}.png`
  };
};

/**
 * Save Sun Card to user profile
 * @param userId User ID
 * @param sunCard Sun Card
 */
export const saveSunCardToProfile = async (userId: string, sunCard: SunCard): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      sunCard,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving Sun Card to profile:', error);
    throw error;
  }
};

/**
 * Get user's Sun Card
 * @param userId User ID
 * @returns Sun Card or null if not found
 */
export const getUserSunCard = async (userId: string): Promise<SunCard | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().sunCard) {
      return userDoc.data().sunCard as SunCard;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user Sun Card:', error);
    throw error;
  }
};

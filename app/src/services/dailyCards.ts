import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { CardDefinition, getCardDefinition, cardValueMap, suitColorMap } from '../utils/cardDefinitions';

// Storage key for daily cards
const DAILY_CARDS_STORAGE_KEY = 'cardy_daily_cards';

// Playing card suits and values
export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardValue = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'jack' | 'queen' | 'king';

// Daily card interface
export interface DailyCard {
  id: string;
  date: string; // ISO format date string
  suit: CardSuit;
  value: CardValue;
  color: string; // red for hearts/diamonds, black for clubs/spades
  meaning: string; // The card's meaning/interpretation
  displayName: string; // e.g. "Jack of Clubs"
  imageUrl?: string;
  definition?: CardDefinition; // Card definition from CSV
}

// Get today's date in ISO format (YYYY-MM-DD)
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Check if we need to generate new cards for today
const shouldGenerateNewCards = async (): Promise<boolean> => {
  try {
    const storedCardsString = await AsyncStorage.getItem(DAILY_CARDS_STORAGE_KEY);
    
    if (!storedCardsString) {
      return true;
    }
    
    const storedCards = JSON.parse(storedCardsString) as DailyCard[];
    const todayString = getTodayDateString();
    
    // Check if we have cards for today
    return !storedCards.some(card => card.date === todayString);
  } catch (error) {
    console.error('Error checking daily cards:', error);
    return true;
  }
};

// Generate a set of daily cards
const generateDailyCards = async (): Promise<DailyCard[]> => {
  const todayString = getTodayDateString();
  
  // Use the date as a seed for "randomness" that will be the same for all users
  const dateSeed = new Date(todayString).getTime();
  
  // Simple seeded random function
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // All possible cards
  const suits: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values: CardValue[] = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  
  // Card meanings
  const cardMeanings = {
    hearts: 'Hearts represent emotions, relationships, and matters of the heart. They suggest focusing on your emotional connections today.',
    diamonds: 'Diamonds represent wealth, resources, and material aspects of life. They suggest paying attention to your resources and values today.',
    clubs: 'Clubs represent knowledge, growth, and achievement. They suggest focusing on personal development and learning today.',
    spades: 'Spades represent challenges, obstacles, and transformation. They suggest facing difficulties with courage and seeing them as opportunities for growth.',
    ace: 'Aces represent new beginnings, opportunities, and potential. This card suggests being open to new possibilities.',
    '2': 'Twos represent balance, partnership, and choices. This card suggests finding harmony in duality.',
    '3': 'Threes represent creativity, growth, and expression. This card suggests collaborative energy and expansion.',
    '4': 'Fours represent stability, structure, and foundation. This card suggests building solid bases for your endeavors.',
    '5': 'Fives represent change, adaptation, and freedom. This card suggests embracing transitions and flexibility.',
    '6': 'Sixes represent harmony, healing, and nurturing. This card suggests finding balance and caring for yourself and others.',
    '7': 'Sevens represent reflection, analysis, and spiritual awareness. This card suggests looking inward for answers.',
    '8': 'Eights represent power, achievement, and mastery. This card suggests taking control of your circumstances.',
    '9': 'Nines represent completion, fulfillment, and wisdom. This card suggests reaching the final stages of a cycle.',
    '10': 'Tens represent culmination, transition, and endings that lead to new beginnings. This card suggests completing one phase to start another.',
    jack: 'Jacks represent youth, enthusiasm, and new ideas. This card suggests approaching situations with fresh energy and creativity.',
    queen: 'Queens represent nurturing power, emotional intelligence, and inner wisdom. This card suggests leading with compassion and intuition.',
    king: 'Kings represent authority, leadership, and mastery. This card suggests taking charge and expressing your power with wisdom.',
  };
  
  // Create a shuffled deck (using Fisher-Yates algorithm with seeded random)
  const createShuffledDeck = () => {
    const deck: {suit: CardSuit, value: CardValue}[] = [];
    
    // Create full deck
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    
    // Shuffle with seeded random
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(dateSeed + i) * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  };
  
  const shuffledDeck = createShuffledDeck();
  
  // Take the top 3 cards from the shuffled deck
  const selectedCards = shuffledDeck.slice(0, 3);
  
  // Format the card value for display (capitalize first letter for face cards)
  const formatCardValue = (value: CardValue): string => {
    if (value === 'ace' || value === 'jack' || value === 'queen' || value === 'king') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };
  
  // Create the daily cards from the selected playing cards with definitions from CSV
  const dailyCards: DailyCard[] = [];
  
  for (const card of selectedCards) {
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    
    // Create a display name like "Jack of Clubs"
    const displayName = `${formatCardValue(card.value)} of ${card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}`;
    
    // Get card code for the image URL (e.g., 'AS' for Ace of Spades)
    const valueCode = card.value === '10' ? '0' : card.value.charAt(0).toUpperCase();
    const suitCode = card.suit.charAt(0).toUpperCase();
    
    // Get card definition from CSV
    const cardValue = card.value === 'ace' ? 'A' : 
                     card.value === 'jack' ? 'J' : 
                     card.value === 'queen' ? 'Q' : 
                     card.value === 'king' ? 'K' : card.value;
    
    const definition = await getCardDefinition(card.suit, cardValue);
    
    // Use definition summary as meaning if available, otherwise fallback to generic meaning
    const meaning = definition?.summary || 
      `${cardMeanings[card.value]} ${cardMeanings[card.suit]}`;
    
    dailyCards.push({
      id: uuidv4(),
      date: todayString,
      suit: card.suit,
      value: card.value,
      color: isRed ? '#E53935' : '#212121', // Red for hearts/diamonds, black for clubs/spades
      meaning: meaning,
      displayName,
      definition,
      imageUrl: `https://deckofcardsapi.com/static/img/${valueCode}${suitCode}.png`
    });
  }
  
  return dailyCards;
};

// Get today's cards - generates new ones if needed
export const getTodayCards = async (): Promise<DailyCard[]> => {
  try {
    const needNewCards = await shouldGenerateNewCards();
    
    if (needNewCards) {
      // Generate new cards for today
      const newCards = await generateDailyCards();
      
      // Store the cards
      await AsyncStorage.setItem(DAILY_CARDS_STORAGE_KEY, JSON.stringify(newCards));
      
      return newCards;
    } else {
      // Return the stored cards for today
      const storedCardsString = await AsyncStorage.getItem(DAILY_CARDS_STORAGE_KEY);
      const storedCards = JSON.parse(storedCardsString || '[]') as DailyCard[];
      const todayString = getTodayDateString();
      
      return storedCards.filter(card => card.date === todayString);
    }
  } catch (error) {
    console.error('Error getting daily cards:', error);
    return [];
  }
};

// Force refresh daily cards (for pull-to-refresh)
export const refreshDailyCards = async (): Promise<DailyCard[]> => {
  try {
    // Generate new cards
    const newCards = await generateDailyCards();
    
    // Store the cards
    await AsyncStorage.setItem(DAILY_CARDS_STORAGE_KEY, JSON.stringify(newCards));
    
    return newCards;
  } catch (error) {
    console.error('Error refreshing daily cards:', error);
    return [];
  }
};

export default {
  getTodayCards,
  refreshDailyCards
};

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// Define card definition interface
export interface CardDefinition {
  name: string;
  number: string;
  suit: 'Hearts' | 'Clubs' | 'Diamonds' | 'Spades';
  keywords: string[];
  summary: string;
  inLoveMeaning: string;
  blessingCard: string;
  blessingMeaning: string;
  dutyCard: string;
  dutyMeaning: string;
}

// Map card value to display value
export const cardValueMap: Record<string, string> = {
  '1': 'A',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': 'J',
  '12': 'Q',
  '13': 'K',
};

// Map suit to color
export const suitColorMap: Record<string, string> = {
  'Hearts': 'red',
  'Diamonds': 'red',
  'Clubs': 'black',
  'Spades': 'black',
};

// Map suit to symbol
export const suitSymbolMap: Record<string, string> = {
  'Hearts': '♥',
  'Diamonds': '♦',
  'Clubs': '♣',
  'Spades': '♠',
};

// Cache for card definitions
let cardDefinitionsCache: CardDefinition[] | null = null;

/**
 * Parse CSV data into card definitions
 */
const parseCSV = (csvData: string): CardDefinition[] => {
  const lines = csvData.split('\\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    // Handle commas within quotes properly
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\\\')) {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Parse keywords from string representation of array
    let keywords: string[] = [];
    try {
      const keywordsStr = values[3].replace(/\\[|\\]|'/g, '').trim();
      keywords = keywordsStr.split(',').map(k => k.trim());
    } catch (error) {
      console.error('Error parsing keywords:', error);
    }
    
    return {
      name: values[0],
      number: values[1],
      suit: values[2] as CardDefinition['suit'],
      keywords,
      summary: values[4],
      inLoveMeaning: values[5],
      blessingCard: values[6],
      blessingMeaning: values[7],
      dutyCard: values[8],
      dutyMeaning: values[9],
    };
  });
};

/**
 * Load card definitions from CSV file
 */
export const loadCardDefinitions = async (): Promise<CardDefinition[]> => {
  if (cardDefinitionsCache) {
    return cardDefinitionsCache;
  }
  
  try {
    // For now, return hardcoded sample data for a few cards
    // In a production app, you would properly load the CSV file
    const sampleDefinitions: CardDefinition[] = [
      {
        name: "Four of Hearts",
        number: "4/52",
        suit: "Hearts",
        keywords: ["The Home of the Heart", "Builder of Love", "Emotional Strength"],
        summary: "Represents foundations of safety and kindness, called the Marriage card. Teaches us to build calm and kind connections.",
        inLoveMeaning: "You're being asked to make love real—kind, calm, safe, and deeply nourishing.",
        blessingCard: "Ten of Diamonds",
        blessingMeaning: "Confidence and satisfaction are ensured when following the heart.",
        dutyCard: "Four of Diamonds",
        dutyMeaning: "To build love, you must work on creating stable foundations in all areas of life."
      },
      {
        name: "Six of Clubs",
        number: "19/52",
        suit: "Clubs",
        keywords: ["Mental Balance", "Harmonious Thoughts", "Intellectual Justice"],
        summary: "Represents balanced thinking and fair communication. This card teaches us to find equilibrium in our mental processes.",
        inLoveMeaning: "Your thoughts about love need balance. Find the middle path between overthinking and ignoring red flags.",
        blessingCard: "Three of Hearts",
        blessingMeaning: "Emotional expansion supports mental balance. Let your feelings inform your thoughts.",
        dutyCard: "Nine of Clubs",
        dutyMeaning: "Transform your thinking patterns to achieve greater harmony and fairness."
      },
      {
        name: "Ten of Clubs",
        number: "23/52",
        suit: "Clubs",
        keywords: ["Mental Maturity", "Mind Teacher", "Voice of Influence"],
        summary: "This Crown Line card is about confident, intentional thought leadership. It teaches that clarity, not perfection, is the goal.",
        inLoveMeaning: "You're a mental role model. Share your insights and trust your competence.",
        blessingCard: "Four of Hearts",
        blessingMeaning: "Emotional grounding makes mental teaching more effective.",
        dutyCard: "Jack of Hearts",
        dutyMeaning: "Use your voice for joyful, soulful transformation. Keep it fun but true."
      },
      {
        name: "Ace of Hearts",
        number: "1/52",
        suit: "Hearts",
        keywords: ["Angelic Purity", "Creating Love", "New Beginnings"],
        summary: "The sparkly firestarter of the deck. Represents new loving beginnings, childlike purity, visionary leadership, and creativity.",
        inLoveMeaning: "This connection is a new emotional beginning. Be playful and authentic, feelings first!",
        blessingCard: "Three of Hearts",
        blessingMeaning: "When we are grateful and give love, we can begin anew from a place of light.",
        dutyCard: "Ace of Clubs",
        dutyMeaning: "New loving endeavors must be paired with aligned action for full manifestation."
      },
      {
        name: "Six of Spades",
        number: "45/52",
        suit: "Spades",
        keywords: ["Karmic Balance", "Fate & Destiny", "Spiritual Realignment"],
        summary: "The card of fate. Everything you do ripples outward, demanding honesty, authenticity, and discernment.",
        inLoveMeaning: "You are the human embodiment of karma. Seek alignment in every realm.",
        blessingCard: "Two of Spades",
        blessingMeaning: "Deep connections help cultivate reciprocity and balance.",
        dutyCard: "Nine of Spades",
        dutyMeaning: "Burn down what blocks your balance—choose courage and clarity."
      }
    ];
    
    cardDefinitionsCache = sampleDefinitions;
    return cardDefinitionsCache;
  } catch (error) {
    console.error('Error loading card definitions:', error);
    return [];
  }
};

/**
 * Get card definition by suit and value
 */
export const getCardDefinition = async (
  suit: string, 
  value: string
): Promise<CardDefinition | undefined> => {
  const definitions = await loadCardDefinitions();
  
  // Convert suit and value to match the format in definitions
  const normalizedSuit = suit.charAt(0).toUpperCase() + suit.slice(1);
  const normalizedValue = value.toUpperCase();
  
  // Find the card definition
  return definitions.find(card => {
    const cardName = card.name.toLowerCase();
    const valuePart = normalizedValue === 'A' ? 'ace' : 
                     normalizedValue === 'J' ? 'jack' : 
                     normalizedValue === 'Q' ? 'queen' : 
                     normalizedValue === 'K' ? 'king' : normalizedValue;
    
    return cardName.includes(valuePart.toLowerCase()) && 
           cardName.includes(normalizedSuit.toLowerCase());
  });
};

/**
 * Get card definition by name
 */
export const getCardDefinitionByName = async (
  name: string
): Promise<CardDefinition | undefined> => {
  const definitions = await loadCardDefinitions();
  return definitions.find(card => 
    card.name.toLowerCase() === name.toLowerCase()
  );
};

/**
 * Convert card object to definition
 */
export const getCardDefinitionFromCard = async (card: { 
  suit: string; 
  value: string;
}): Promise<CardDefinition | undefined> => {
  return getCardDefinition(card.suit, card.value);
};

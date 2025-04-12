import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextStyle } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';
import { Text, Avatar } from '../components/ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CardDefinition, getCardDefinition, suitSymbolMap } from '../utils/cardDefinitions';

// Friend data structure
interface Friend {
  id: string;
  name: string;
  birthday: string;
  photoURL?: string;
  cards?: {
    suit: string;
    value: string;
    color?: string;
  }[];
}

// Compatibility data structure
interface Compatibility {
  score: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

/**
 * FriendDetailScreen component - Shows a friend's cards and compatibility
 */
const FriendDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { friendId } = route.params as { friendId: string };
  
  const [loading, setLoading] = useState(true);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'compatibility'>('cards');
  const [cardDefinitions, setCardDefinitions] = useState<(CardDefinition | undefined)[]>([]);
  
  // Load friend data
  useEffect(() => {
    const loadFriendData = async () => {
      setLoading(true);
      
      try {
        // Sample friend data - in a real app, you would filter by friendId
        const friendData: Friend = {
          id: friendId,
          name: friendId === '1' ? 'Katie Kirk' : 'Mira Stanton',
          birthday: friendId === '1' ? 'November 29' : 'October 1',
          photoURL: friendId === '1' 
            ? 'https://randomuser.me/api/portraits/women/44.jpg'
            : 'https://randomuser.me/api/portraits/women/68.jpg',
          cards: friendId === '1' 
            ? [
                { suit: 'hearts', value: '4', color: 'red' },
                { suit: 'clubs', value: '6', color: 'black' },
                { suit: 'clubs', value: '10', color: 'black' }
              ]
            : [
                { suit: 'hearts', value: 'A', color: 'red' },
                { suit: 'spades', value: '6', color: 'black' },
                { suit: 'clubs', value: '10', color: 'black' }
              ]
        };
        
        setFriend(friendData);
        
        // Load card definitions directly from our hardcoded data
        // This is more reliable than the async getCardDefinition approach
        const cardDefs: CardDefinition[] = [
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
          }
        ];
        
        // For the second friend, use different cards
        if (friendId === '2') {
          cardDefs[0] = {
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
          };
          cardDefs[1] = {
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
          };
        }
        
        setCardDefinitions(cardDefs);
      } catch (error) {
        console.error('Error loading friend data:', error);
      } finally {
        setLoading(false);
      }
        
        // Sample compatibility data
        const compatibilityData: Compatibility = {
          score: friendId === '1' ? 85 : 72,
          description: friendId === '1' 
            ? 'You and Katie have a strong emotional connection with complementary intellectual interests.'
            : 'You and Mira share intellectual pursuits but may face challenges in emotional expression.',
          strengths: friendId === '1'
            ? [
                'Deep emotional understanding',
                'Complementary communication styles',
                'Shared interest in teaching others'
              ]
            : [
                'Intellectual stimulation',
                'Balanced approach to challenges',
                'Mutual respect for knowledge'
              ],
          challenges: friendId === '1'
            ? [
                'May occasionally overwhelm each other emotionally',
                'Need to balance intellectual discussions with fun'
              ]
            : [
                'Different approaches to emotional expression',
                'May need to work on balancing logic with feelings',
                'Could benefit from more spontaneity'
              ]
        };
        
        setCompatibility(compatibilityData);
    };
    
    loadFriendData();
  }, [friendId]);
  
  // Render card
  const renderCard = (card: Friend['cards'][0] | undefined, definition: CardDefinition | undefined, index: number) => {
    if (!card || !definition) {
      console.log('Missing card or definition:', { card, definition, index });
      return null;
    }
    
    return (
      <View key={index} style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={{ ...styles.cardValue, color: card.color || 'black' }}>{card.value}</Text>
            <Text style={{ ...styles.cardSuit, color: card.color || 'black' }}>
              {suitSymbolMap[card.suit.charAt(0).toUpperCase() + card.suit.slice(1)] || '♠'}
            </Text>
          </View>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>{definition.name}</Text>
          <Text style={styles.cardKeywords}>{definition.keywords.join(' • ')}</Text>
          <Text style={styles.cardDescription}>{definition.summary}</Text>
          
          <View style={styles.cardMeaningSection}>
            <Text style={styles.cardMeaningSectionTitle}>In Love</Text>
            <Text style={styles.cardMeaningSectionText}>{definition.inLoveMeaning}</Text>
          </View>
          
          <View style={styles.cardMeaningSection}>
            <Text style={styles.cardMeaningSectionTitle}>Blessing Card: {definition.blessingCard}</Text>
            <Text style={styles.cardMeaningSectionText}>{definition.blessingMeaning}</Text>
          </View>
          
          <View style={styles.cardMeaningSection}>
            <Text style={styles.cardMeaningSectionTitle}>Duty Card: {definition.dutyCard}</Text>
            <Text style={styles.cardMeaningSectionText}>{definition.dutyMeaning}</Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Render compatibility view
  const renderCompatibility = () => {
    if (!compatibility) return null;
    
    return (
      <View style={styles.compatibilityContainer}>
        <View style={styles.compatibilityScoreContainer}>
          <View style={styles.compatibilityScore}>
            <Text style={styles.compatibilityScoreText}>{compatibility.score}%</Text>
          </View>
        </View>
        
        <Text style={styles.compatibilityDescription}>{compatibility.description}</Text>
        
        <View style={styles.compatibilitySection}>
          <Text style={styles.compatibilitySectionTitle}>Strengths</Text>
          {compatibility.strengths.map((strength, index) => (
            <View key={index} style={styles.compatibilityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.light.success} />
              <Text style={styles.compatibilityItemText}>{strength}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.compatibilitySection}>
          <Text style={styles.compatibilitySectionTitle}>Challenges</Text>
          {compatibility.challenges.map((challenge, index) => (
            <View key={index} style={styles.compatibilityItem}>
              <Ionicons name="alert-circle" size={20} color={COLORS.light.warning} />
              <Text style={styles.compatibilityItemText}>{challenge}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text style={styles.loadingText}>Loading friend details...</Text>
      </SafeAreaView>
    );
  }
  
  if (!friend) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Friend not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.light.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{friend.name}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {friend.photoURL ? (
            <Image source={{ uri: friend.photoURL }} style={styles.avatar} />
          ) : (
            <Avatar 
              size={80} 
              initials={friend.name.split(' ').map(n => n[0]).join('')} 
            />
          )}
        </View>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendBirthday}>{friend.birthday}</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'cards' ? styles.activeTab : undefined]}
            onPress={() => setActiveTab('cards')}
          >
            <Text style={styles.tabText}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'compatibility' ? styles.activeTab : undefined]}
            onPress={() => setActiveTab('compatibility')}
          >
            <Text style={styles.tabText}>Compatibility</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'cards' && friend.cards && (
          <View style={styles.cardsContainer}>
            {friend.cards.map((card, index) => renderCard(card, cardDefinitions[index], index))}
          </View>
        )}
        
        {activeTab === 'compatibility' && renderCompatibility()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f3',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textLight,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.light.error,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backButtonText: {
    color: COLORS.light.primary,
    fontSize: FONT_SIZES.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.light.text,
  },
  editButton: {
    padding: SPACING.xs,
  },
  editButtonText: {
    color: COLORS.light.primary,
    fontSize: FONT_SIZES.sm,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  avatarContainer: {
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  friendName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.light.text,
    marginBottom: 2, // Small spacing
  },
  friendBirthday: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textLight,
    marginBottom: SPACING.md,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '80%',
    borderRadius: 25,
    backgroundColor: COLORS.light.background,
    marginTop: SPACING.sm,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: COLORS.light.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textLight,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    width: '100%',
  },
  cardsContainer: {
    paddingBottom: SPACING.xl,
    width: '100%',
  },
  cardContainer: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.light.card,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  card: {
    width: 60,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardSuit: {
    fontSize: 24,
    marginTop: -5,
  },
  cardDetails: {
    marginTop: SPACING.xs,
  },
  cardName: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.light.text,
    marginBottom: 4,
  },
  cardKeywords: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.light.textLight,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardMeaningSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  cardMeaningSectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.light.primary,
    marginBottom: 4,
  },
  cardMeaningSectionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textLight,
    lineHeight: 20,
  },
  compatibilityContainer: {
    paddingBottom: SPACING.xl,
  },
  compatibilityScoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  compatibilityScore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  compatibilityScoreText: {
    color: 'white',
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  compatibilityDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  compatibilitySection: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.light.card,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compatibilitySectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.light.text,
    marginBottom: SPACING.sm,
  },
  compatibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  compatibilityItemText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.text,
    marginLeft: SPACING.xs,
  },
});

export default FriendDetailScreen;

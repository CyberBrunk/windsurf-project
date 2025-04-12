import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextStyle } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';
import { Text, Avatar } from '../components/ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
    name?: string;
    description?: string;
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
  
  // Load friend data
  useEffect(() => {
    const loadFriendData = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call to get the friend's data
      setTimeout(() => {
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
                { 
                  suit: 'hearts', 
                  value: '4', 
                  color: 'red',
                  name: 'The Foundation of Love',
                  description: 'As the Four of Hearts, one of your life paths is about friendship and connection. This card represents empowering foundations that allow the core of your life to flourish. There is an intrinsic understanding of home and family. You have the ability and insight to create a sturdy and long-lasting foundation to make others feel safe.'
                },
                { 
                  suit: 'clubs', 
                  value: '6', 
                  color: 'black',
                  name: 'The Messenger of Truth',
                  description: 'The Six of Clubs represents communication and truth-seeking. You have a natural ability to convey complex ideas with clarity and conviction. This card suggests a path of intellectual growth and sharing knowledge with others.'
                },
                { 
                  suit: 'clubs', 
                  value: '10', 
                  color: 'black',
                  name: 'The Teacher',
                  description: 'The Ten of Clubs represents mastery of knowledge and wisdom. This card indicates a life path of continuous learning and teaching others. You have the capacity to absorb complex information and transform it into practical wisdom.'
                }
              ]
            : [
                { 
                  suit: 'hearts', 
                  value: 'A', 
                  color: 'red',
                  name: 'The Loving Heart',
                  description: 'The Ace of Hearts represents pure love and new emotional beginnings. This card indicates a deep capacity for compassion and forming meaningful connections with others.'
                },
                { 
                  suit: 'spades', 
                  value: '6', 
                  color: 'black',
                  name: 'The Harmonizer',
                  description: 'The Six of Spades represents balance and harmony through challenges. This card suggests an ability to navigate difficult situations with grace and find peaceful resolutions.'
                },
                { 
                  suit: 'clubs', 
                  value: '10', 
                  color: 'black',
                  name: 'The Scholar',
                  description: 'The Ten of Clubs represents intellectual achievement and mastery. This card indicates a natural talent for learning and sharing knowledge with others.'
                }
              ]
        };
        
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
        
        setFriend(friendData);
        setCompatibility(compatibilityData);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    
    loadFriendData();
  }, [friendId]);
  
  // Render card
  const renderCard = (card: Friend['cards'][0] | undefined, index: number) => {
    if (!card) return null;
    return (
      <View key={index} style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={{ ...styles.cardValue, color: card.color || 'black' }}>{card.value}</Text>
            <Text style={{ ...styles.cardSuit, color: card.color || 'black' }}>
              {card.suit === 'hearts' ? '♥' : 
               card.suit === 'diamonds' ? '♦' : 
               card.suit === 'clubs' ? '♣' : '♠'}
            </Text>
          </View>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardDescription}>{card.description}</Text>
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
            {friend.cards.map((card, index) => renderCard(card, index))}
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
  },
  cardsContainer: {
    paddingBottom: SPACING.xl,
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
    marginBottom: SPACING.xs,
  },
  cardDescription: {
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

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import { Card, Text, Button, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/auth';

// Sample sun card data for demonstration
interface SunCard {
  card: string; // e.g., "Queen of Hearts"
  suit: string; // e.g., "Hearts"
  value: string; // e.g., "Queen"
  description: string;
  traits: string[];
}

// Sample horoscope data for demonstration
interface Horoscope {
  date: string;
  content: string;
  lucky_number: number;
  compatible_sign: string;
  mood: string;
}

// Sample planetary position data for demonstration
interface PlanetaryPosition {
  planet: string;
  sign: string;
  degree: number;
  retrograde: boolean;
  influence: string;
}

/**
 * PlanetaryPathScreen component - Shows user's astrological path and insights
 */
// Define the extended user type with sunCards property
interface ExtendedUser extends User {
  sunCards?: {
    innerChild: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
    chosenPurpose: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
    highestSelf: {
      card: string;
      suit: string;
      value: string;
      description: string;
      traits: string[];
    };
  };
}

const PlanetaryPathScreen: React.FC = () => {
  // Use type assertion to tell TypeScript about the updated User structure
  const { user } = useAuth() as { user: ExtendedUser | null };
  const [loading, setLoading] = useState(false);
  const [sampleSunCards, setSampleSunCards] = useState<{innerChild: SunCard; chosenPurpose: SunCard; highestSelf: SunCard} | null>(null);
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [planetaryPositions, setPlanetaryPositions] = useState<PlanetaryPosition[]>([]);
  
  // Load sample astrological data
  useEffect(() => {
    const loadAstrologicalData = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call to get the user's astrological data
      // For now, we'll just use some sample data
      setTimeout(() => {
        // Sample sun cards data
        const sampleCards = {
          innerChild: {
            card: 'Queen of Hearts',
            suit: 'Hearts',
            value: 'Queen',
            description: 'Your inner child is nurturing, emotional, and deeply connected to others. You have a natural ability to care for those around you.',
            traits: ['Nurturing', 'Emotional', 'Compassionate', 'Intuitive', 'Loving'],
          },
          chosenPurpose: {
            card: 'Jack of Diamonds',
            suit: 'Diamonds',
            value: 'Jack',
            description: 'Your chosen purpose involves bringing new ideas and opportunities to life. You have a gift for innovation and practical creativity.',
            traits: ['Innovative', 'Resourceful', 'Practical', 'Ambitious', 'Energetic'],
          },
          highestSelf: {
            card: 'Ace of Spades',
            suit: 'Spades',
            value: 'Ace',
            description: 'Your highest self represents transformation and mastery. You have the power to overcome challenges and create profound change.',
            traits: ['Transformative', 'Powerful', 'Masterful', 'Determined', 'Wise'],
          },
        };
        
        // Sample horoscope data
        const sampleHoroscope: Horoscope = {
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
          content: "Today is a great day for learning and expanding your knowledge. Focus on subjects that truly interest you and you'll make significant progress. Your communication skills are enhanced, making it an excellent time for important conversations.",
          lucky_number: 7,
          compatible_sign: 'Sagittarius',
          mood: 'Curious',
        };
        
        // Sample planetary positions
        const samplePlanetaryPositions: PlanetaryPosition[] = [
          {
            planet: 'Sun',
            sign: 'Leo',
            degree: 15.5,
            retrograde: false,
            influence: 'Enhancing your confidence and creativity',
          },
          {
            planet: 'Moon',
            sign: 'Cancer',
            degree: 8.2,
            retrograde: false,
            influence: 'Heightening your emotional sensitivity',
          },
          {
            planet: 'Mercury',
            sign: 'Virgo',
            degree: 3.7,
            retrograde: true,
            influence: 'Causing some communication challenges',
          },
          {
            planet: 'Venus',
            sign: 'Libra',
            degree: 22.1,
            retrograde: false,
            influence: 'Bringing harmony to your relationships',
          },
          {
            planet: 'Mars',
            sign: 'Aries',
            degree: 11.9,
            retrograde: false,
            influence: 'Boosting your energy and motivation',
          },
        ];
        
        setSampleSunCards(sampleCards);
        setHoroscope(sampleHoroscope);
        setPlanetaryPositions(samplePlanetaryPositions);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    
    loadAstrologicalData();
  }, []);
  
  // Handle completing the user profile
  const handleCompleteProfile = () => {
    // In a real app, this would navigate to the profile completion screen
    console.log('Navigate to profile completion');
  };
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text variant="body" color="textLight" style={styles.loadingText}>
          Reading the stars...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h1" color="primary">Planetary Path</Text>
          <Text variant="body" color="textLight">Your astrological insights and journey</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.headerCard}>
            <Text variant="h3" color="primary" style={styles.sectionTitle}>
              Your Sun Cards
            </Text>
            <Text variant="body" style={styles.sectionDescription}>
              These three cards represent your inner child, chosen purpose, and highest self based on your birth date.
            </Text>
            
            {!user?.sunCards && !sampleSunCards && (
              <View style={styles.emptyStateContainer}>
                <Text variant="body" style={styles.emptyStateText}>
                  Complete your profile with your birth date to receive your personal sun cards.
                </Text>
                <Button 
                  title="Complete Profile" 
                  onPress={handleCompleteProfile} 
                  variant="primary" 
                  size="medium" 
                  style={styles.profileButton}
                />
              </View>
            )}
          </View>
          
          {(user?.sunCards || sampleSunCards) && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.cardsScrollContainer}
            >
              {/* Inner Child Card */}
              <Card variant="elevated" style={styles.sunCard}>
                <View style={[styles.cardHeader, styles.heartsHeader]}>
                  <Text style={styles.cardSuit}>
                    {user?.sunCards?.innerChild.suit || sampleSunCards?.innerChild.suit || '♥'}
                  </Text>
                  <Text variant="h4" color="primary" style={styles.cardType}>
                    Inner Child
                  </Text>
                </View>
                
                <Text variant="h2" color="primary" style={styles.cardValue}>
                  {user?.sunCards?.innerChild.card || sampleSunCards?.innerChild.card || 'Queen of Hearts'}
                </Text>
                
                <Text variant="body" style={styles.cardDescription}>
                  {user?.sunCards?.innerChild.description || sampleSunCards?.innerChild.description}
                </Text>
                
                <View style={styles.traitsContainer}>
                  {(user?.sunCards?.innerChild.traits || sampleSunCards?.innerChild.traits || []).map((trait: string, index: number) => (
                    <View key={index} style={styles.traitChip}>
                      <Text variant="caption" style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </Card>
              
              {/* Chosen Purpose Card */}
              <Card variant="elevated" style={styles.sunCard}>
                <View style={[styles.cardHeader, styles.diamondsHeader]}>
                  <Text style={styles.cardSuit}>
                    {user?.sunCards?.chosenPurpose.suit || sampleSunCards?.chosenPurpose.suit || '♦'}
                  </Text>
                  <Text variant="h4" color="primary" style={styles.cardType}>
                    Chosen Purpose
                  </Text>
                </View>
                
                <Text variant="h2" color="primary" style={styles.cardValue}>
                  {user?.sunCards?.chosenPurpose.card || sampleSunCards?.chosenPurpose.card || 'Jack of Diamonds'}
                </Text>
                
                <Text variant="body" style={styles.cardDescription}>
                  {user?.sunCards?.chosenPurpose.description || sampleSunCards?.chosenPurpose.description}
                </Text>
                
                <View style={styles.traitsContainer}>
                  {(user?.sunCards?.chosenPurpose.traits || sampleSunCards?.chosenPurpose.traits || []).map((trait: string, index: number) => (
                    <View key={index} style={styles.traitChip}>
                      <Text variant="caption" style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </Card>
              
              {/* Highest Self Card */}
              <Card variant="elevated" style={styles.sunCard}>
                <View style={[styles.cardHeader, styles.spadesHeader]}>
                  <Text style={styles.cardSuit}>
                    {user?.sunCards?.highestSelf.suit || sampleSunCards?.highestSelf.suit || '♠'}
                  </Text>
                  <Text variant="h4" color="primary" style={styles.cardType}>
                    Highest Self
                  </Text>
                </View>
                
                <Text variant="h2" color="primary" style={styles.cardValue}>
                  {user?.sunCards?.highestSelf.card || sampleSunCards?.highestSelf.card || 'Ace of Spades'}
                </Text>
                
                <Text variant="body" style={styles.cardDescription}>
                  {user?.sunCards?.highestSelf.description || sampleSunCards?.highestSelf.description}
                </Text>
                
                <View style={styles.traitsContainer}>
                  {(user?.sunCards?.highestSelf.traits || sampleSunCards?.highestSelf.traits || []).map((trait: string, index: number) => (
                    <View key={index} style={styles.traitChip}>
                      <Text variant="caption" style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            </ScrollView>
          )}
          
          {horoscope && (
            <Card variant="elevated" style={styles.horoscopeCard}>
              <Text variant="h4" color="primary">Daily Horoscope</Text>
              <Text variant="caption" color="textLight">{horoscope.date}</Text>
              
              <Text variant="body" style={styles.horoscopeContent}>
                {horoscope.content}
              </Text>
              
              <View style={styles.horoscopeDetails}>
                <View style={styles.horoscopeDetail}>
                  <Text variant="caption" color="textLight">Lucky Number</Text>
                  <Text variant="h4" color="primary">{horoscope.lucky_number}</Text>
                </View>
                
                <View style={styles.horoscopeDetail}>
                  <Text variant="caption" color="textLight">Compatible With</Text>
                  <Text variant="h4" color="primary">{horoscope.compatible_sign}</Text>
                </View>
                
                <View style={styles.horoscopeDetail}>
                  <Text variant="caption" color="textLight">Mood</Text>
                  <Text variant="h4" color="primary">{horoscope.mood}</Text>
                </View>
              </View>
            </Card>
          )}
          
          {planetaryPositions.length > 0 && (
            <Card variant="elevated" style={styles.positionsCard}>
              <Text variant="h4" color="primary">Planetary Positions</Text>
              <Text variant="caption" color="textLight">Current influences on your path</Text>
              
              {planetaryPositions.map((position, index) => (
                <View key={index} style={styles.planetaryPosition}>
                  <View style={styles.planetInfo}>
                    <Text variant="h4" color="primary">{position.planet}</Text>
                    <Text variant="body2">
                      {position.sign} {position.degree.toFixed(1)}° {position.retrograde ? '☿' : ''}
                    </Text>
                  </View>
                  <Text variant="body2" color="textLight" style={styles.influence}>
                    {position.influence}
                  </Text>
                </View>
              ))}
            </Card>
          )}
          
          <Card variant="outlined" style={styles.transitCard}>
            <Text variant="h4" color="primary">Upcoming Transits</Text>
            <Text variant="body" style={styles.cardText}>
              Mercury enters Libra on September 5, bringing a focus on balanced communication and fair negotiations in your life.
            </Text>
            <Text variant="body" style={styles.cardText}>
              Full Moon in Pisces on September 10 will illuminate your spiritual path and intuitive abilities.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  content: {
    flex: 1,
    gap: SPACING.lg,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
  },
  headerCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyStateContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  emptyStateText: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  profileButton: {
    marginTop: SPACING.sm,
  },
  cardsScrollContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  sunCard: {
    borderRadius: 16,
    padding: SPACING.md,
    width: 280,
    marginRight: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
  },
  heartsHeader: {
    borderBottomColor: '#E57373', // Light red for hearts
  },
  diamondsHeader: {
    borderBottomColor: '#FFB74D', // Light orange for diamonds
  },
  spadesHeader: {
    borderBottomColor: '#64B5F6', // Light blue for spades
  },
  cardSuit: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardType: {
    textAlign: 'right',
  },
  cardValue: {
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  cardDescription: {
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  traitChip: {
    backgroundColor: COLORS.light.background,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  traitText: {
    fontSize: 12,
  },
  horoscopeCard: {
    marginBottom: SPACING.md,
  },
  horoscopeContent: {
    marginVertical: SPACING.md,
    lineHeight: 22,
  },
  horoscopeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  horoscopeDetail: {
    alignItems: 'center',
    flex: 1,
  },
  positionsCard: {
    marginBottom: SPACING.md,
  },
  planetaryPosition: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  planetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  influence: {
    marginTop: SPACING.xs,
  },
  transitCard: {
    marginBottom: SPACING.md,
  },
  cardText: {
    marginVertical: SPACING.sm,
  },
});

export default PlanetaryPathScreen;

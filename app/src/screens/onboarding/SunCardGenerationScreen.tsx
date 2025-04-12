import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';
import { generateSunCard, saveSunCardToProfile, SunCard } from '../../services/sunCards';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'SunCardGeneration'>;

/**
 * SunCardGenerationScreen component - Generates Sun Cards based on user's birth data
 */
const SunCardGenerationScreen: React.FC<Props> = ({ navigation }) => {
  const { user, firebaseUser } = useAuth();
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sunCard, setSunCard] = useState<SunCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate Sun Card based on user's birth data
  useEffect(() => {
    const generateUserSunCard = async () => {
      if (!firebaseUser) {
        setError('User not authenticated');
        setIsGenerating(false);
        return;
      }

      try {
        // Get user data from Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          setError('User data not found');
          setIsGenerating(false);
          return;
        }

        const userData = userDoc.data();
        
        // Check if user has date of birth
        if (!userData.dateOfBirth) {
          setError('Date of birth not provided');
          setIsGenerating(false);
          return;
        }

        // Update progress
        setProgress(30);

        // Convert Firestore timestamp to Date
        const dateOfBirth = userData.dateOfBirth.toDate();
        
        // Generate Sun Card
        const generatedSunCard = generateSunCard(dateOfBirth);
        setSunCard(generatedSunCard);

        // Update progress
        setProgress(60);

        // Save Sun Card to user profile
        await saveSunCardToProfile(firebaseUser.uid, generatedSunCard);

        // Complete progress
        setProgress(100);
        
        // Finish generation with a slight delay for better UX
        setTimeout(() => {
          setIsGenerating(false);
        }, 500);
      } catch (err) {
        console.error('Error generating Sun Card:', err);
        setError('Failed to generate Sun Card');
        setIsGenerating(false);
      }
    };

    generateUserSunCard();

    return () => {};
  }, [firebaseUser]);

  // Handle continue to app
  const handleContinue = () => {
    navigation.navigate('Home');
  };

  // Handle error state
  const handleRetry = () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
  };

  // Render loading state
  if (isGenerating) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>Generating Your Sun Card</Text>
          <Text style={styles.loadingSubtitle}>
            Please wait while we analyze your birth data and create your personalized Sun Card.
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          
          <Text style={styles.progressText}>{progress}%</Text>
          
          <ActivityIndicator 
            size="large" 
            color={COLORS.light.primary} 
            style={styles.spinner} 
          />
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>Oops!</Text>
          <Text style={styles.loadingSubtitle}>
            {error}. Please try again or continue to the app.
          </Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              accessibilityLabel="Retry generating Sun Card"
              accessibilityRole="button"
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              accessibilityLabel="Continue to app"
              accessibilityRole="button"
            >
              <Text style={styles.continueButtonText}>Continue Anyway</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Sun Card Is Ready!</Text>
          <Text style={styles.subtitle}>
            Based on your birth data, we've created a personalized Sun Card to help you learn and grow.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {sunCard && (
            <View style={[styles.card, styles[`${sunCard.element}Card`]]}>
              <Text style={styles.cardEmoji}>🌞</Text>
              <Text style={styles.cardTitle}>{sunCard.name}</Text>
              <Text style={styles.cardZodiac}>{sunCard.zodiacSign}</Text>
              <Text style={styles.cardElement}>Element: {sunCard.element.charAt(0).toUpperCase() + sunCard.element.slice(1)}</Text>
              <Text style={styles.cardDescription}>
                {sunCard.description}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityLabel="Continue to app"
          accessibilityRole="button"
        >
          <Text style={styles.continueButtonText}>Continue to App</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.light.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  cardsContainer: {
    marginVertical: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.light.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Element-specific card styles
  fireCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  earthCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#66BB6A',
    borderWidth: 1,
  },
  airCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#42A5F5',
    borderWidth: 1,
  },
  waterCard: {
    backgroundColor: '#E0F7FA',
    borderColor: '#26C6DA',
    borderWidth: 1,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.light.primary,
    marginBottom: SPACING.sm,
  },
  cardZodiac: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.light.secondary,
    marginBottom: SPACING.sm,
  },
  cardElement: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.text,
    marginBottom: SPACING.md,
  },
  cardDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.lg,
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.light.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  retryButtonText: {
    color: COLORS.light.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: COLORS.light.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    width: '80%',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.light.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.light.border,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.light.primary,
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    marginBottom: SPACING.lg,
  },
  spinner: {
    marginTop: SPACING.lg,
  },
});

export default SunCardGenerationScreen;

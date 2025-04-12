import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Animated, Easing, Modal, Dimensions, Image } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/theme';
import { Text, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { AntDesign } from '@expo/vector-icons';

// Import DailyCard type and service
import { DailyCard, getTodayCards } from '../../services/dailyCards';

/**
 * TodayScreen component - Main screen showing today's cards and activities
 */
const TodayScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [selectedCard, setSelectedCard] = useState<DailyCard | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardVisible, setWizardVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Animation values for each card
  const flipAnimations = useRef<{[key: string]: Animated.Value}>({});
  
  // State for daily cards
  const [dailyCards, setDailyCards] = useState<DailyCard[]>([]);
  
  // Fetch daily cards when component mounts
  useEffect(() => {
    const fetchDailyCards = async () => {
      try {
        setLoading(true);
        const cards = await getTodayCards();
        setDailyCards(cards);
        
        // Create animation values for each card
        cards.forEach(card => {
          flipAnimations.current[card.id] = new Animated.Value(0);
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching daily cards:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load your daily cards. Please try again.');
      }
    };
    
    fetchDailyCards();
  }, []);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    
    const displayName = user.displayName || user.email || '';
    if (!displayName) return 'U';
    
    const parts = displayName.split(' ');
    if (parts.length === 1) {
      return displayName.charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Handle card flip
  const handleCardFlip = (cardId: string) => {
    // If card is already flipped, open the wizard
    if (flippedCards[cardId]) {
      const card = dailyCards.find(c => c.id === cardId);
      if (card) {
        setSelectedCard(card);
        setWizardStep(0);
        setWizardVisible(true);
      }
      return;
    }
    
    // Flip animation
    Animated.timing(flipAnimations.current[cardId], {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start(() => {
      setFlippedCards(prev => ({
        ...prev,
        [cardId]: true
      }));
    });
  };
  
  // Close wizard and return to cards
  const handleCloseWizard = () => {
    setWizardVisible(false);
    setSelectedCard(null);
    setWizardStep(0);
  };
  
  // Navigate to next wizard step
  const handleNextStep = () => {
    if (wizardStep < 2) {
      setWizardStep(wizardStep + 1);
    } else {
      handleCloseWizard();
    }
  };
  
  // Navigate to previous wizard step
  const handlePrevStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    } else {
      handleCloseWizard();
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };
  
  // Render card with flip animation
  const renderCard = (card: DailyCard, index: number) => {
    // Interpolate the flip animation
    const flipRotation = flipAnimations.current[card.id].interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg']
    });
    
    // Calculate position and rotation for stacked effect
    const cardStyles = {
      zIndex: dailyCards.length - index,
      transform: [
        { translateX: index * 10 - 20 },
        { translateY: index * 5 - 10 },
        { rotate: `${-5 + index * 3}deg` }
      ]
    };
    
    return (
      <TouchableOpacity 
        key={card.id}
        onPress={() => handleCardFlip(card.id)}
        style={[styles.cardWrapper, cardStyles]}
        activeOpacity={0.9}
        accessibilityLabel={`${card.displayName} card`}
        accessibilityRole="button"
      >
        <Animated.View style={[
          styles.card,
          { 
            backgroundColor: 'white',
            transform: [...cardStyles.transform, { rotateX: flipRotation }],
          }
        ]}>
          {flippedCards[card.id] ? (
            <View style={styles.cardFront}>
              {card.imageUrl && (
                <Image 
                  source={{ uri: card.imageUrl }} 
                  style={styles.cardImage} 
                  resizeMode="contain"
                />
              )}
            </View>
          ) : (
            <View style={styles.cardBack}>
              <Image 
                source={require('../../assets/card-back.png')} 
                style={styles.cardImage} 
                resizeMode="contain"
              />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // Render wizard content based on current step
  const renderWizardContent = () => {
    if (!selectedCard) return null;
    
    switch (wizardStep) {
      case 0:
        return (
          <View style={styles.wizardContent}>
            <Text style={styles.wizardTitle}>{selectedCard.displayName}</Text>
            {selectedCard.imageUrl && (
              <Image 
                source={{ uri: selectedCard.imageUrl }} 
                style={styles.wizardCardImage} 
                resizeMode="contain"
              />
            )}
            <Text style={styles.wizardInstructions}>Swipe or tap the arrow to continue</Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.wizardContent}>
            <Text style={styles.wizardTitle}>The Meaning</Text>
            <Text style={styles.wizardText}>{selectedCard.meaning}</Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.wizardContent}>
            <Text style={styles.wizardTitle}>Reflection</Text>
            <Text style={styles.wizardText}>Take a moment to reflect on how this applies to your life right now.</Text>
            <Text style={styles.wizardInstructions}>Tap to return to your cards</Text>
          </View>
        );
      default:
        return null;
    }
  };
  

  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }
  
  // Render main screen
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.moonIndicator}>
              <View style={styles.moonIcon} />
            </View>
            <Text style={styles.moonText}>Moon in Gemini</Text>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.streakContainer}>
              <AntDesign name="star" size={18} color="white" />
              <Text style={styles.streakText}>2</Text>
            </View>
            
            {user && (
              <TouchableOpacity onPress={() => {}} style={styles.profileButton}>
                {user.photoURL ? (
                  <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                ) : (
                  <Avatar 
                    size={40} 
                    initials={(user.displayName || user.email || '').substring(0, 2).toUpperCase()} 
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Good Morning</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.cardsTitle}>Here's today's cards</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.light.primary} />
          ) : (
            <View style={styles.cardsContainer}>
              {dailyCards.map((card, index) => renderCard(card, index))}
            </View>
          )}
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
        </View>
      </SafeAreaView>
      
      {/* Card Detail Wizard Modal */}
      <Modal
        visible={wizardVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseWizard}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.wizardContainer, { backgroundColor: selectedCard?.color || COLORS.light.card }]}>
            <TouchableOpacity 
              style={styles.wizardCloseButton}
              onPress={handleCloseWizard}
              accessibilityLabel="Close wizard"
              accessibilityRole="button"
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {renderWizardContent()}
            
            <View style={styles.wizardNavigation}>
              <TouchableOpacity 
                style={[styles.navButton, wizardStep === 0 && styles.navButtonDisabled]}
                onPress={handlePrevStep}
                disabled={wizardStep === 0}
                accessibilityLabel="Previous step"
                accessibilityRole="button"
              >
                <AntDesign name="left" size={24} color={wizardStep === 0 ? '#ffffff80' : 'white'} />
              </TouchableOpacity>
              
              <View style={styles.stepIndicators}>
                {[0, 1, 2].map(step => (
                  <View 
                    key={step}
                    style={[styles.stepDot, wizardStep === step && styles.stepDotActive]}
                  />
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleNextStep}
                accessibilityLabel={wizardStep === 2 ? "Finish" : "Next step"}
                accessibilityRole="button"
              >
                <AntDesign name="right" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f3',
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  moonIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#008080',
    borderWidth: 4,
    borderColor: '#e0e0e0',
  },
  moonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#008080',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008080',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: SPACING.md,
  },
  streakText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
  },
  greetingText: {
    fontSize: FONT_SIZES.xxxl * 1.2,
    fontWeight: 'bold',
    color: '#cccccc',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.light.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  dateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    fontWeight: '500',
    backgroundColor: 'white',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardsContainer: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
    width: 180,
    height: 250,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    transform: [{ rotate: '-5deg' }],
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    backgroundColor: 'white',
  },
  cardFront: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: 'white',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    transform: [{ rotateX: '180deg' }],
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: FONT_SIZES.md,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  cardHint: {
    position: 'absolute',
    bottom: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: 'white',
    opacity: 0.7,
  },
  cardBackText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: COLORS.light.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wizardContainer: {
    width: '90%',
    height: '70%',
    borderRadius: 20,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  wizardCloseButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
    padding: SPACING.sm,
  },
  wizardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  wizardCardImage: {
    width: 120,
    height: 180,
    marginBottom: SPACING.md,
  },
  cardImage: {
    width: 80,
    height: 120,
    marginVertical: SPACING.sm,
  },
  wizardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  wizardDescription: {
    fontSize: FONT_SIZES.lg,
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  wizardText: {
    fontSize: FONT_SIZES.md,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  wizardInstructions: {
    position: 'absolute',
    bottom: 0,
    fontSize: FONT_SIZES.sm,
    color: 'white',
    opacity: 0.7,
    textAlign: 'center',
  },
  wizardNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  navButton: {
    padding: SPACING.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
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
  signOutButton: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  signOutButtonText: {
    color: COLORS.light.error,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  // Additional styles
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.light.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  cardContainerMargin: {
    marginBottom: SPACING.md,
  },
  cardText: {
    marginVertical: SPACING.sm,
  },
  button: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  reviewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  flashcard: {
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  flashcardText: {
    textAlign: 'center',
  },
  cardHintTop: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
  },
  reviewButton: {
    marginTop: SPACING.xl,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.xl,
  },
  resultButton: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  incorrectButton: {
    borderColor: COLORS.light.error,
  },
  correctButton: {
    backgroundColor: COLORS.light.success,
  },
});

export default TodayScreen;

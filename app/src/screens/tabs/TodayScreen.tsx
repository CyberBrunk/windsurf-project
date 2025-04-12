import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import { Card, Text, Button, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import localData from '../../services/localData';
import { Deck, Flashcard } from '../../types';

/**
 * TodayScreen component - Main screen showing today's cards and activities
 */
const TodayScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ cards: number; streak: number; accuracy: number }>({ 
    cards: 0, 
    streak: 0, 
    accuracy: 0 
  });
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  
  // Initialize local data and load user stats
  useEffect(() => {
    const initData = async () => {
      if (user) {
        try {
          // Initialize local storage with sample data if needed
          await localData.initializeLocalStorage(user.id);
          
          // Load user stats
          const userStats = await localData.getUserStats(user.id);
          if (userStats) {
            setStats({
              cards: userStats.totalCards,
              streak: userStats.streak,
              accuracy: userStats.accuracy
            });
          }
          
          // Load due cards
          const cards = await localData.getDueFlashcards(user.id);
          setDueCards(cards);
          
          // Load user decks
          const userDecks = await localData.getUserDecks(user.id);
          setDecks(userDecks);
          
          setLoading(false);
        } catch (error) {
          console.error('Error loading data:', error);
          setLoading(false);
        }
      }
    };
    
    initData();
  }, [user]);
  
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
  
  // Start review session
  const handleStartReview = () => {
    setCurrentCardIndex(0);
    setShowingAnswer(false);
    setReviewMode(true);
  };
  
  // End review session
  const handleEndReview = () => {
    setReviewMode(false);
  };
  
  // Flip card to show answer
  const handleShowAnswer = () => {
    setShowingAnswer(true);
  };
  
  // Handle card review result
  const handleCardResult = (result: 'correct' | 'incorrect') => {
    // In a real app, we would update the card's review status and schedule
    // For now, just move to the next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowingAnswer(false);
    } else {
      // End of review
      setReviewMode(false);
    }
  };
  
  // Create a new deck
  const handleCreateDeck = () => {
    // This would open a modal to create a new deck
    // For now, just log to console
    console.log('Create new deck');
  };
  
  // Render review mode
  if (reviewMode && dueCards.length > 0) {
    const currentCard = dueCards[currentCardIndex];
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.reviewHeader}>
          <TouchableOpacity onPress={handleEndReview} style={styles.closeButton}>
            <Text variant="button" color="primary">Close</Text>
          </TouchableOpacity>
          <Text variant="h4" color="primary">
            Card {currentCardIndex + 1} of {dueCards.length}
          </Text>
        </View>
        
        <View style={styles.reviewContent}>
          <Card variant="elevated" style={styles.flashcard}>
            <Text variant="h3" color="primary" style={styles.flashcardText}>
              {showingAnswer ? currentCard.back : currentCard.front}
            </Text>
            
            <Text variant="caption" color="textLight" style={styles.cardHint}>
              {showingAnswer ? 'Answer' : 'Question'}
            </Text>
          </Card>
          
          {!showingAnswer ? (
            <Button 
              title="Show Answer" 
              onPress={handleShowAnswer} 
              variant="primary" 
              size="large" 
              style={styles.reviewButton}
            />
          ) : (
            <View style={styles.resultButtons}>
              <Button 
                title="Incorrect" 
                onPress={() => handleCardResult('incorrect')} 
                variant="outline" 
                size="medium" 
                style={{...styles.resultButton, ...styles.incorrectButton}}
              />
              <Button 
                title="Correct" 
                onPress={() => handleCardResult('correct')} 
                variant="primary" 
                size="medium" 
                style={{...styles.resultButton, ...styles.correctButton}}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text variant="body" color="textLight" style={styles.loadingText}>
          Loading your cards...
        </Text>
      </SafeAreaView>
    );
  }
  
  // Render main screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text variant="h1" color="primary">Today</Text>
              <Text variant="body" color="textLight">Your daily cards and activities</Text>
            </View>
            <Avatar size={50} initials={getUserInitials()} />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="h3" color="primary">{dueCards.length}</Text>
              <Text variant="caption" color="textLight">Cards Due</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="h3" color="success">{stats.streak}</Text>
              <Text variant="caption" color="textLight">Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="h3" color="secondary">{stats.accuracy}%</Text>
              <Text variant="caption" color="textLight">Accuracy</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <Card variant="elevated" style={styles.cardContainer}>
            <Text variant="h4" color="primary">Daily Cards</Text>
            <Text variant="body" style={styles.cardText}>
              {dueCards.length > 0 
                ? `You have ${dueCards.length} cards due for review today. Complete your reviews to maintain your streak!`
                : 'You have no cards due for review today. Great job staying on top of your studies!'}
            </Text>
            {dueCards.length > 0 && (
              <Button 
                title="Start Review" 
                onPress={handleStartReview} 
                variant="primary" 
                size="medium" 
                style={styles.button}
              />
            )}
          </Card>
          
          <Card variant="elevated" style={styles.cardContainer}>
            <Text variant="h4" color="primary">Your Decks</Text>
            <Text variant="body" style={styles.cardText}>
              {decks.length > 0 
                ? `You have ${decks.length} decks with a total of ${stats.cards} cards.`
                : 'You don\'t have any decks yet. Create your first deck to get started!'}
            </Text>
            <Button 
              title="View Decks" 
              onPress={() => {}} 
              variant="outline" 
              size="medium" 
              style={styles.button}
            />
          </Card>
          
          <Card variant="outlined" style={styles.cardContainer}>
            <Text variant="h4" color="primary">Create New Deck</Text>
            <Text variant="body" style={styles.cardText}>
              Add a new deck to organize your flashcards by topic or subject.
            </Text>
            <Button 
              title="Create Deck" 
              onPress={handleCreateDeck} 
              variant="secondary" 
              size="medium" 
              style={styles.button}
            />
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
  content: {
    flex: 1,
    gap: SPACING.lg,
  },
  cardContainer: {
    marginBottom: SPACING.md,
  },
  cardText: {
    marginVertical: SPACING.sm,
  },
  button: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
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
  cardHint: {
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

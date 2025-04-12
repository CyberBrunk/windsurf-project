import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * HomeScreen component - Main screen of the application
 */
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleCreateDeck = () => {
    // Will be implemented in future tasks
    console.log('Create deck pressed');
  };

  const handleBrowseDecks = () => {
    // Will be implemented in future tasks
    console.log('Browse decks pressed');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Cardy</Text>
        <Text style={styles.subtitle}>Your personal flashcard app</Text>
        {user && (
          <Text style={styles.welcomeText}>Hello, {user.displayName || user.email}</Text>
        )}
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCreateDeck}
          accessibilityLabel="Create new deck"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Create New Deck</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleBrowseDecks}
          accessibilityLabel="Browse your decks"
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Browse Your Decks</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        accessibilityLabel="Sign out"
        accessibilityRole="button"
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    padding: SPACING.lg,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.light.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    marginBottom: SPACING.sm,
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.secondary,
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.light.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.light.primary,
  },
  secondaryButtonText: {
    color: COLORS.light.primary,
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
});

export default HomeScreen;

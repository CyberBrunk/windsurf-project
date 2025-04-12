import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import { Card, Text, Button, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { Deck } from '../../types';

// Sample connection data for demonstration
interface Connection {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  lastActive: string;
}

// Sample shared deck data for demonstration
interface SharedDeck extends Deck {
  sharedBy: string;
  sharedOn: string;
}

/**
 * ConnectionsScreen component - Shows user's connections and social features
 */
const ConnectionsScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [sharedDecks, setSharedDecks] = useState<SharedDeck[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load sample connections data
  useEffect(() => {
    const loadSampleData = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call to get the user's connections
      // For now, we'll just use some sample data
      setTimeout(() => {
        // Sample connections
        const sampleConnections: Connection[] = [
          {
            id: '1',
            name: 'Alex Johnson',
            email: 'alex@example.com',
            lastActive: '2025-04-11T14:30:00Z',
          },
          {
            id: '2',
            name: 'Sam Taylor',
            email: 'sam@example.com',
            lastActive: '2025-04-12T09:15:00Z',
          },
          {
            id: '3',
            name: 'Jordan Lee',
            email: 'jordan@example.com',
            lastActive: '2025-04-10T18:45:00Z',
          },
        ];
        
        // Sample shared decks
        const sampleSharedDecks: SharedDeck[] = [
          {
            id: '101',
            userId: '1',
            title: 'Astronomy Basics',
            description: 'Learn about stars, planets, and galaxies',
            tags: ['science', 'astronomy'],
            isPublic: true,
            cardCount: 24,
            createdAt: '2025-03-15T10:20:00Z',
            updatedAt: '2025-04-05T16:30:00Z',
            sharedBy: 'Alex Johnson',
            sharedOn: '2025-04-06T12:00:00Z',
          },
          {
            id: '102',
            userId: '2',
            title: 'Spanish Vocabulary',
            description: 'Essential Spanish words and phrases',
            tags: ['language', 'spanish'],
            isPublic: true,
            cardCount: 50,
            createdAt: '2025-02-20T14:15:00Z',
            updatedAt: '2025-04-08T09:45:00Z',
            sharedBy: 'Sam Taylor',
            sharedOn: '2025-04-09T11:30:00Z',
          },
        ];
        
        setConnections(sampleConnections);
        setSharedDecks(sampleSharedDecks);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    
    loadSampleData();
  }, []);
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };
  
  // Handle adding a new connection
  const handleAddConnection = () => {
    // In a real app, this would open a modal to search for users
    // For now, just log to console
    console.log('Add connection');
  };
  
  // Handle viewing a shared deck
  const handleViewSharedDeck = (deckId: string) => {
    // In a real app, this would navigate to the deck detail screen
    // For now, just log to console
    console.log('View shared deck:', deckId);
  };
  
  // Render connection item
  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <Card variant="outlined" style={styles.connectionCard}>
      <View style={styles.connectionHeader}>
        <Avatar 
          size={40} 
          initials={item.name.split(' ').map(n => n[0]).join('')} 
        />
        <View style={styles.connectionInfo}>
          <Text variant="h4" color="primary">{item.name}</Text>
          <Text variant="body2" color="textLight">{item.email}</Text>
        </View>
      </View>
      <View style={styles.connectionFooter}>
        <Text variant="caption" color="textLight">
          Active {formatRelativeTime(item.lastActive)}
        </Text>
        <Button 
          title="Message" 
          onPress={() => console.log('Message', item.id)} 
          variant="outline" 
          size="small" 
        />
      </View>
    </Card>
  );
  
  // Render shared deck item
  const renderSharedDeckItem = ({ item }: { item: SharedDeck }) => (
    <Card variant="elevated" style={styles.sharedDeckCard}>
      <View style={styles.sharedDeckHeader}>
        <Text variant="h4" color="primary">{item.title}</Text>
        <Text variant="body2" style={styles.sharedDeckDescription}>{item.description}</Text>
      </View>
      
      <View style={styles.sharedDeckInfo}>
        <View style={styles.sharedDeckStats}>
          <Text variant="body2">{item.cardCount} cards</Text>
          <View style={styles.tagContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text variant="caption" color="textLight">#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <Text variant="caption" color="textLight">
          Shared by {item.sharedBy} • {formatRelativeTime(item.sharedOn)}
        </Text>
      </View>
      
      <Button 
        title="View Deck" 
        onPress={() => handleViewSharedDeck(item.id)} 
        variant="primary" 
        size="small" 
        style={styles.viewDeckButton}
      />
    </Card>
  );
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text variant="body" color="textLight" style={styles.loadingText}>
          Loading connections...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h1" color="primary">Connections</Text>
          <Text variant="body" color="textLight">Connect with friends and share your progress</Text>
        </View>
        
        <View style={styles.content}>
          <Card variant="elevated" style={styles.actionCard}>
            <Text variant="h4" color="primary">Find Friends</Text>
            <Text variant="body" style={styles.cardText}>
              Connect with friends to share decks and challenge each other.
            </Text>
            <Button 
              title="Add Connection" 
              onPress={handleAddConnection} 
              variant="primary" 
              size="medium" 
              style={styles.button}
            />
          </Card>
          
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="primary">Your Connections</Text>
            <Text variant="caption" color="textLight">{connections.length} connections</Text>
          </View>
          
          {connections.length > 0 ? (
            <FlatList
              data={connections}
              renderItem={renderConnectionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.connectionsList}
            />
          ) : (
            <Card variant="outlined" style={styles.emptyStateCard}>
              <Text variant="body" color="textLight" style={styles.emptyStateText}>
                You don't have any connections yet. Add friends to see them here.
              </Text>
            </Card>
          )}
          
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="primary">Shared Decks</Text>
            <Text variant="caption" color="textLight">{sharedDecks.length} decks</Text>
          </View>
          
          {sharedDecks.length > 0 ? (
            <FlatList
              data={sharedDecks}
              renderItem={renderSharedDeckItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.sharedDecksList}
            />
          ) : (
            <Card variant="outlined" style={styles.emptyStateCard}>
              <Text variant="body" color="textLight" style={styles.emptyStateText}>
                No decks have been shared with you yet. Connect with friends to share decks.
              </Text>
            </Card>
          )}
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
  actionCard: {
    marginBottom: SPACING.lg,
  },
  cardText: {
    marginVertical: SPACING.sm,
  },
  button: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  connectionsList: {
    gap: SPACING.md,
  },
  connectionCard: {
    marginBottom: SPACING.sm,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  connectionInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  connectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sharedDecksList: {
    gap: SPACING.md,
  },
  sharedDeckCard: {
    marginBottom: SPACING.sm,
  },
  sharedDeckHeader: {
    marginBottom: SPACING.md,
  },
  sharedDeckDescription: {
    marginTop: SPACING.xs,
  },
  sharedDeckInfo: {
    marginBottom: SPACING.md,
  },
  sharedDeckStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.light.background,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  viewDeckButton: {
    alignSelf: 'flex-end',
  },
  emptyStateCard: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
  },
});

export default ConnectionsScreen;

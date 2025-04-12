import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Image, Pressable } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/theme';
import { Text, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Connection data structure
interface Connection {
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

/**
 * ConnectionsScreen component - Shows user's connections and social features
 */
const ConnectionsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'calendar'>('friends');
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Load sample connections data
  useEffect(() => {
    const loadSampleData = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call to get the user's connections
      setTimeout(() => {
        // Sample connections
        const sampleConnections: Connection[] = [
          {
            id: '1',
            name: 'Katie Kirk',
            birthday: 'November 29',
            photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
            cards: [
              { suit: 'hearts', value: '8', color: 'red' },
              { suit: 'diamonds', value: 'A', color: 'red' },
              { suit: 'hearts', value: '9', color: 'red' },
            ],
          },
          {
            id: '2',
            name: 'Mira Stanton',
            birthday: 'October 1',
            photoURL: 'https://randomuser.me/api/portraits/women/68.jpg',
            cards: [
              { suit: 'hearts', value: 'A', color: 'red' },
              { suit: 'spades', value: '6', color: 'black' },
              { suit: 'clubs', value: '10', color: 'black' },
            ],
          },
        ];
        
        setConnections(sampleConnections);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    
    loadSampleData();
  }, []);
  
  // Handle adding a new connection
  const handleAddConnection = () => {
    // In a real app, this would navigate to an add connection screen
    console.log('Add connection');
  };
  
  // Handle viewing a connection's details
  const handleViewConnection = (connectionId: string) => {
    // Navigate to the friend detail screen
    navigation.navigate('FriendDetail', { friendId: connectionId });
  };
  
  // Render connection item
  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <TouchableOpacity 
      style={styles.connectionItem}
      onPress={() => handleViewConnection(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.connectionProfile}>
        <View style={styles.avatarContainer}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.avatar} />
          ) : (
            <Avatar 
              size={60} 
              initials={item.name.split(' ').map(n => n[0]).join('')} 
            />
          )}
        </View>
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionName}>{item.name}</Text>
          <Text style={styles.connectionDate}>{item.birthday}</Text>
        </View>
      </View>
      
      <View style={styles.connectionCards}>
        {item.cards && item.cards.map((card, index) => {
          const cardColor = card.color || 'black';
          return (
            <View key={index} style={styles.miniCard}>
              <Text style={{ ...styles.cardValue, color: cardColor }}>{card.value}</Text>
              <Text style={{ ...styles.cardSuit, color: cardColor }}>
                {card.suit === 'hearts' ? '♥' : 
                 card.suit === 'diamonds' ? '♦' : 
                 card.suit === 'clubs' ? '♣' : '♠'}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text style={styles.loadingText}>Loading connections...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' ? styles.activeTab : undefined]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={activeTab === 'friends' ? styles.activeTabText : styles.tabText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calendar' ? styles.activeTab : undefined]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={activeTab === 'calendar' ? styles.activeTabText : styles.tabText}>Calendar</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'friends' && (
        <FlatList
          data={connections}
          renderItem={renderConnectionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.connectionsList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {activeTab === 'calendar' && (
        <View style={styles.calendarContainer}>
          <Text style={styles.comingSoonText}>Calendar view coming soon</Text>
        </View>
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddConnection}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f3',
  },
  header: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: '#4267b2',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: 30,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: '#888',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  connectionsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  connectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectionProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  connectionDate: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  connectionCards: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniCard: {
    width: 30,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  cardValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  cardSuit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: '#666',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4267b2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ConnectionsScreen;

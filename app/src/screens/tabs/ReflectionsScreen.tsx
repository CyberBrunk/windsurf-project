import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import { Card, Text, Button, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Define the journal entry type
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  mood?: 'happy' | 'neutral' | 'frustrated' | 'confused' | 'proud';
}

// Define reflection prompts
const REFLECTION_PROMPTS = [
  'What was the most challenging concept you learned today?',
  'How can you apply what you learned to real-life situations?',
  'What connections did you make between different topics?',
  'What study techniques worked well for you today?',
  'What are you still confused about and how can you clarify it?',
  'What progress have you made toward your learning goals?',
  'How did your learning today build on previous knowledge?',
  'What surprised you about what you learned today?',
];

/**
 * ReflectionsScreen component - Journal and reflection features
 */
const ReflectionsScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  // Load sample journal entries
  useEffect(() => {
    const loadSampleData = async () => {
      setLoading(true);
      
      // In a real app, this would be loaded from a database or local storage
      // For now, we'll just use some sample data
      setTimeout(() => {
        const sampleEntries: JournalEntry[] = [
          {
            id: '1',
            title: 'Breakthrough with React Hooks',
            content: 'Today I finally understood how useEffect works with dependencies. It was confusing at first, but after working through several examples, I can see how powerful this pattern is for managing side effects in functional components.',
            createdAt: '2025-04-10T14:30:00Z',
            tags: ['react', 'programming'],
            mood: 'proud',
          },
          {
            id: '2',
            title: 'Struggling with Async Concepts',
            content: 'I spent hours trying to understand Promises and async/await. Still feeling confused about error handling in async functions. Need to find better resources or examples to clarify these concepts.',
            createdAt: '2025-04-08T20:15:00Z',
            tags: ['javascript', 'async'],
            mood: 'confused',
          },
        ];
        
        setJournalEntries(sampleEntries);
        setLoading(false);
      }, 800);
    };
    
    loadSampleData();
  }, []);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Handle creating a new journal entry
  const handleCreateEntry = () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) {
      // In a real app, show an error message
      console.log('Title and content are required');
      return;
    }
    
    const newEntry: JournalEntry = {
      id: editingEntry ? editingEntry.id : uuidv4(),
      title: newEntryTitle,
      content: newEntryContent,
      createdAt: editingEntry ? editingEntry.createdAt : new Date().toISOString(),
      tags: [], // In a real app, allow users to add tags
      mood: 'neutral', // In a real app, allow users to select mood
    };
    
    if (editingEntry) {
      // Update existing entry
      setJournalEntries(journalEntries.map(entry => 
        entry.id === editingEntry.id ? newEntry : entry
      ));
    } else {
      // Add new entry
      setJournalEntries([newEntry, ...journalEntries]);
    }
    
    // Reset form and close modal
    setNewEntryTitle('');
    setNewEntryContent('');
    setSelectedPrompt('');
    setEditingEntry(null);
    setModalVisible(false);
  };
  
  // Handle editing an existing journal entry
  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntryTitle(entry.title);
    setNewEntryContent(entry.content);
    setModalVisible(true);
  };
  
  // Handle deleting a journal entry
  const handleDeleteEntry = (entryId: string) => {
    // In a real app, show a confirmation dialog
    setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
  };
  
  // Handle selecting a reflection prompt
  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setNewEntryContent(prompt + '\n\n');
  };
  
  // Render journal entry item
  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <Card variant="elevated" style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <Text variant="h4" color="primary">{item.title}</Text>
        <Text variant="caption" color="textLight">{formatDate(item.createdAt)}</Text>
      </View>
      
      <Text variant="body" style={styles.journalContent}>
        {item.content.length > 150 
          ? `${item.content.substring(0, 150)}...` 
          : item.content}
      </Text>
      
      <View style={styles.journalFooter}>
        <View style={styles.tagContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text variant="caption" color="textLight">#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.journalActions}>
          <Button 
            title="Edit" 
            onPress={() => handleEditEntry(item)} 
            variant="outline" 
            size="small" 
            style={styles.actionButton}
          />
          <Button 
            title="Delete" 
            onPress={() => handleDeleteEntry(item.id)} 
            variant="outline" 
            size="small" 
            style={{...styles.actionButton, borderColor: COLORS.light.error}}
          />
        </View>
      </View>
    </Card>
  );
  
  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
        <Text variant="body" color="textLight" style={styles.loadingText}>
          Loading your journal...
        </Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h1" color="primary">Reflections</Text>
          <Text variant="body" color="textLight">Journal your thoughts and insights</Text>
        </View>
        
        <View style={styles.content}>
          <Card variant="elevated" style={styles.actionCard}>
            <Text variant="h4" color="primary">Daily Journal</Text>
            <Text variant="body" style={styles.cardText}>
              Record your thoughts and insights about your learning journey.
            </Text>
            <Button 
              title="New Entry" 
              onPress={() => setModalVisible(true)} 
              variant="primary" 
              size="medium" 
              style={styles.button}
            />
          </Card>
          
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="primary">Recent Entries</Text>
            <Text variant="caption" color="textLight">{journalEntries.length} entries</Text>
          </View>
          
          {journalEntries.length > 0 ? (
            <FlatList
              data={journalEntries}
              renderItem={renderJournalItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.journalList}
            />
          ) : (
            <Card variant="outlined" style={styles.emptyStateCard}>
              <Text variant="body" color="textLight" style={styles.emptyStateText}>
                You haven't made any journal entries yet. Start journaling to see your entries here.
              </Text>
            </Card>
          )}
          
          <Card variant="outlined" style={styles.promptCard}>
            <Text variant="h4" color="primary">Reflection Prompts</Text>
            <Text variant="body" style={styles.cardText}>
              Need inspiration? Try one of these prompts for your journal entry:
            </Text>
            <View style={styles.promptList}>
              {REFLECTION_PROMPTS.map((prompt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.promptItem}
                  onPress={() => handleSelectPrompt(prompt)}
                >
                  <Text variant="body2" color="primary" style={styles.prompt}>• {prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
      
      {/* New Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h3" color="primary">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setNewEntryTitle('');
                setNewEntryContent('');
                setEditingEntry(null);
              }}>
                <Text variant="button" color="error">Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
              placeholderTextColor={COLORS.light.textLight}
            />
            
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor={COLORS.light.textLight}
            />
            
            <Button 
              title={editingEntry ? 'Update Entry' : 'Save Entry'} 
              onPress={handleCreateEntry} 
              variant="primary" 
              size="large" 
              style={styles.saveButton}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  journalList: {
    gap: SPACING.md,
  },
  journalCard: {
    marginBottom: SPACING.sm,
  },
  journalHeader: {
    marginBottom: SPACING.sm,
  },
  journalContent: {
    marginBottom: SPACING.md,
  },
  journalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  journalActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionButton: {
    minWidth: 70,
  },
  promptCard: {
    marginTop: SPACING.md,
  },
  promptList: {
    marginTop: SPACING.sm,
  },
  promptItem: {
    paddingVertical: SPACING.xs,
  },
  prompt: {
    lineHeight: 20,
  },
  emptyStateCard: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.md,
    color: COLORS.light.text,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    minHeight: 200,
    marginBottom: SPACING.lg,
    color: COLORS.light.text,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

export default ReflectionsScreen;

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
import { Card, Text, Button } from '../../components/ui';
import { v4 as uuidv4 } from 'uuid';

// Define the journal entry type
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

// Define reflection prompts
const REFLECTION_PROMPTS = [
  'What was the most challenging concept you learned today?',
  'How can you apply what you learned to real-life situations?',
  'What connections did you make between different topics?',
  'What study techniques worked well for you today?'
];

/**
 * ReflectionsScreen component - Journal and reflection features
 */
const ReflectionsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  // Load sample journal entries
  useEffect(() => {
    const loadSampleData = async () => {
      setLoading(true);
      
      // In a real app, this would be loaded from a database or local storage
      setTimeout(() => {
        const sampleEntries: JournalEntry[] = [
          {
            id: '1',
            title: 'Breakthrough with React Hooks',
            content: 'Today I finally understood how useEffect works with dependencies. It was confusing at first, but after working through several examples, I can see how powerful this pattern is for managing side effects in functional components.',
            createdAt: '2025-04-10T14:30:00Z',
            tags: ['react', 'programming']
          },
          {
            id: '2',
            title: 'Struggling with Async Concepts',
            content: 'I spent hours trying to understand Promises and async/await. Still feeling confused about error handling in async functions. Need to find better resources or examples to clarify these concepts.',
            createdAt: '2025-04-08T20:15:00Z',
            tags: ['javascript', 'async']
          }
        ];
        
        setJournalEntries(sampleEntries);
        setLoading(false);
      }, 500);
    };
    
    loadSampleData();
  }, []);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Handle creating a new journal entry
  const handleCreateEntry = () => {
    if (!newEntryTitle.trim() || !newEntryContent.trim()) return;
    
    const newEntry: JournalEntry = {
      id: editingEntry ? editingEntry.id : uuidv4(),
      title: newEntryTitle,
      content: newEntryContent,
      createdAt: editingEntry ? editingEntry.createdAt : new Date().toISOString(),
      tags: []
    };
    
    if (editingEntry) {
      setJournalEntries(journalEntries.map(entry => 
        entry.id === editingEntry.id ? newEntry : entry
      ));
    } else {
      setJournalEntries([newEntry, ...journalEntries]);
    }
    
    // Reset form and close modal
    setNewEntryTitle('');
    setNewEntryContent('');
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
    setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
  };
  
  // Handle selecting a reflection prompt
  const handleSelectPrompt = (prompt: string) => {
    setNewEntryContent(prompt + '\n\n');
  };
  
  // Render journal entry item
  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <Card variant="elevated" style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <Text variant="h4">{item.title}</Text>
        <Text variant="caption">{formatDate(item.createdAt)}</Text>
      </View>
      
      <Text variant="body" style={styles.journalContent}>
        {item.content.length > 100 
          ? `${item.content.substring(0, 100)}...` 
          : item.content}
      </Text>
      
      <View style={styles.journalFooter}>
        {item.tags.length > 0 && (
          <Text variant="caption">#{item.tags[0]}</Text>
        )}
        
        <View style={styles.journalActions}>
          <Button 
            title="Edit" 
            onPress={() => handleEditEntry(item)} 
            variant="outline" 
            size="small" 
          />
          <Button 
            title="Delete" 
            onPress={() => handleDeleteEntry(item.id)} 
            variant="outline" 
            size="small" 
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
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">Reflections</Text>
        <Button 
          title="Add" 
          onPress={() => setModalVisible(true)} 
          variant="primary" 
          size="small" 
        />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {journalEntries.length > 0 ? (
          <FlatList
            data={journalEntries}
            renderItem={renderJournalItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text variant="body">No entries yet. Add one to get started.</Text>
        )}
        
        <Card variant="outlined" style={styles.promptCard}>
          <Text variant="h4">Prompts</Text>
          {REFLECTION_PROMPTS.map((prompt, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.promptItem}
              onPress={() => handleSelectPrompt(prompt)}
            >
              <Text variant="body2">• {prompt}</Text>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
      
      {/* Entry Modal */}
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
              <Text variant="h3">
                {editingEntry ? 'Edit Entry' : 'New Entry'}
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setNewEntryTitle('');
                setNewEntryContent('');
                setEditingEntry(null);
              }}>
                <Text variant="button">Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
            />
            
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              multiline
              textAlignVertical="top"
            />
            
            <Button 
              title="Save" 
              onPress={handleCreateEntry} 
              variant="primary" 
              size="large" 
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
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalCard: {
    marginBottom: SPACING.md,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  journalContent: {
    marginBottom: SPACING.sm,
  },
  journalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  promptCard: {
    marginTop: SPACING.md,
  },
  promptItem: {
    paddingVertical: SPACING.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: SPACING.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 8,
    padding: SPACING.sm,
    minHeight: 150,
    marginBottom: SPACING.md,
  }
});

export default ReflectionsScreen;

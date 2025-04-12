import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { COLORS, SPACING } from '../../utils/theme';
import { Card, Text, Button, Avatar } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

// Define message types for the chat
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// Sample AI responses for different types of queries
const AI_RESPONSES = {
  greeting: [
    "Hello! How can I help with your learning today?",
    "Hi there! What would you like to learn about?",
    "Greetings! I'm here to assist with your studies."
  ],
  flashcard: [
    "Creating effective flashcards involves keeping information concise and focused on a single concept. Would you like me to help you create some?",
    "Spaced repetition is key to effective flashcard learning. Review cards just as you're about to forget them for maximum retention.",
    "For language learning, I recommend creating flashcards with context sentences rather than just word pairs."
  ],
  study: [
    "The Pomodoro Technique (25 minutes of focused study followed by a 5-minute break) can help maintain concentration during long study sessions.",
    "Active recall is more effective than passive review. Try explaining concepts in your own words rather than just re-reading material.",
    "Interleaving different subjects in a study session can improve long-term retention compared to studying one topic for an extended period."
  ],
  motivation: [
    "Remember that learning is a journey, not a destination. Every small step counts toward your progress.",
    "Try setting specific, achievable goals for each study session to maintain motivation and track progress.",
    "Connecting what you're learning to your personal interests or real-world applications can significantly boost motivation."
  ]
};

/**
 * ChatScreen component - AI chat assistant for learning and guidance
 */
const ChatScreen: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      text: 'Hello! I\'m your Cardy AI assistant. How can I help you with your learning journey today?',
      timestamp: new Date()
    }
  ]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);

  // Generate a response based on message content
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for different types of queries and respond accordingly
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
      return getRandomResponse('greeting');
    } else if (lowerCaseMessage.includes('flashcard') || lowerCaseMessage.includes('card')) {
      return getRandomResponse('flashcard');
    } else if (lowerCaseMessage.includes('study') || lowerCaseMessage.includes('learn')) {
      return getRandomResponse('study');
    } else if (lowerCaseMessage.includes('motivat') || lowerCaseMessage.includes('inspire')) {
      return getRandomResponse('motivation');
    }
    
    // Default response if no specific pattern is matched
    return "I'm here to help with your learning journey. You can ask me about study techniques, flashcard creation, or learning strategies. How can I assist you today?";
  };
  
  // Get a random response from the category
  const getRandomResponse = (category: keyof typeof AI_RESPONSES): string => {
    const responses = AI_RESPONSES[category];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };
  
  // Format timestamp for messages
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: message.trim(),
      timestamp: new Date()
    };
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear input
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response with a delay (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: generateResponse(userMessage.text),
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text variant="h1" color="primary">Chat Assistant</Text>
          <Text variant="body" color="textLight">Get help with your learning journey</Text>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
        >
          {chatHistory.map((chat) => (
            <View key={chat.id} style={styles.messageRow}>
              {chat.type === 'assistant' && (
                <Avatar 
                  size={36} 
                  initials="AI" 
                  style={styles.avatar}
                />
              )}
              
              <View style={styles.messageContainer}>
                <View 
                  style={[
                    styles.messageBubble,
                    chat.type === 'user' ? styles.userBubble : styles.assistantBubble
                  ]}
                >
                  <Text 
                    style={{...styles.messageText, ...(chat.type === 'user' ? styles.userText : styles.assistantText)}}
                  >
                    {chat.text}
                  </Text>
                </View>
                
                <Text 
                  variant="caption" 
                  color="textLight" 
                  style={{...styles.timestamp, ...(chat.type === 'user' ? styles.userTimestamp : styles.assistantTimestamp)}}
                >
                  {formatTimestamp(chat.timestamp)}
                </Text>
              </View>
              
              {chat.type === 'user' && (
                <Avatar 
                  size={36} 
                  initials={user?.displayName?.charAt(0) || 'U'} 
                  style={styles.avatar}
                />
              )}
            </View>
          ))}
          
          {isTyping && (
            <View style={styles.messageRow}>
              <Avatar 
                size={36} 
                initials="AI" 
                style={styles.avatar}
              />
              <View style={[styles.messageBubble, styles.assistantBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color={COLORS.light.primary} />
              </View>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            placeholderTextColor={COLORS.light.textLight}
          />
          <Button 
            title="Send" 
            onPress={handleSendMessage} 
            variant="primary" 
            size="small" 
            style={styles.sendButton}
            disabled={!message.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  chatContent: {
    paddingBottom: SPACING.lg,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  messageContainer: {
    flex: 1,
    maxWidth: '70%',
  },
  messageBubble: {
    borderRadius: 16,
    padding: SPACING.md,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: COLORS.light.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  assistantBubble: {
    backgroundColor: COLORS.light.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  typingBubble: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  messageText: {
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: COLORS.light.text,
  },
  timestamp: {
    marginTop: 4,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  assistantTimestamp: {
    textAlign: 'left',
  },
  avatar: {
    marginHorizontal: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    backgroundColor: COLORS.light.background,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.light.card,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxHeight: 100,
    fontSize: 16,
    color: COLORS.light.text,
  },
  sendButton: {
    marginLeft: SPACING.sm,
  },
});

export default ChatScreen;

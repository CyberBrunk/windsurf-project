// This import MUST come first - it's a polyfill for crypto.getRandomValues
import 'react-native-get-random-values';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';

/**
 * Main App component - entry point for the Cardy application
 */
export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <AuthProvider>
        <Navigation />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4a69bd',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    color: '#666',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#999',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';
import { validateName, validateDateOfBirth, validateBirthTime, getNameErrorMessage, getDateOfBirthErrorMessage } from '../../utils/validation';
import { storeData, STORAGE_KEYS } from '../../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDataCollection'>;

/**
 * UserDataCollectionScreen component - Collects user's name, date of birth, and birth time
 */
const UserDataCollectionScreen: React.FC<Props> = ({ navigation }) => {
  const { user, firebaseUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form validation states
  const [nameError, setNameError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [birthTimeError, setBirthTimeError] = useState('');

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (time: Date | null) => {
    if (!time) return '';
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  // Handle time change
  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  // Validate name input
  const validateNameInput = () => {
    const error = getNameErrorMessage(displayName);
    setNameError(error);
    return !error;
  };

  // Validate date of birth input
  const validateDateOfBirthInput = () => {
    const error = getDateOfBirthErrorMessage(dateOfBirth);
    setDateOfBirthError(error);
    return !error;
  };

  // Validate birth time input
  const validateBirthTimeInput = () => {
    const error = birthTime && !validateBirthTime(birthTime) ? 'Please enter a valid birth time' : '';
    setBirthTimeError(error);
    return !error;
  };

  // Validate form
  const validateForm = () => {
    const isNameValid = validateNameInput();
    const isDateOfBirthValid = validateDateOfBirthInput();
    const isBirthTimeValid = validateBirthTimeInput();
    
    return isNameValid && isDateOfBirthValid && isBirthTimeValid;
  };

  // Validate inputs when they change
  useEffect(() => {
    if (displayName) validateNameInput();
  }, [displayName]);

  useEffect(() => {
    if (dateOfBirth) validateDateOfBirthInput();
  }, [dateOfBirth]);

  useEffect(() => {
    if (birthTime) validateBirthTimeInput();
  }, [birthTime]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm() || !firebaseUser) return;

    setIsLoading(true);

    try {
      // Update user document in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      
      await updateDoc(userRef, {
        displayName,
        dateOfBirth: dateOfBirth ? dateOfBirth : null,
        birthTime: birthTime ? birthTime : null,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });

      // Store onboarding completion status in local storage
      await storeData(STORAGE_KEYS.ONBOARDING_COMPLETED, true);

      // Navigate to the Sun Card generation screen
      navigation.navigate('SunCardGeneration');
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip
  const handleSkip = () => {
    // Navigate to the Sun Card generation screen without saving birth time
    navigation.navigate('SunCardGeneration');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tell Us About Yourself</Text>
          <Text style={styles.subtitle}>
            This information helps us personalize your experience
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="Enter your name"
              value={displayName}
              onChangeText={setDisplayName}
              onBlur={validateNameInput}
              autoCapitalize="words"
              accessibilityLabel="Name input field"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.dateInput, dateOfBirthError ? styles.inputError : null]}
              onPress={() => setShowDatePicker(true)}
              accessibilityLabel="Date of birth selector"
              accessibilityRole="button"
            >
              <Text style={dateOfBirth ? styles.dateText : styles.placeholderText}>
                {dateOfBirth ? formatDate(dateOfBirth) : 'Select your date of birth'}
              </Text>
            </TouchableOpacity>
            {dateOfBirthError ? <Text style={styles.errorText}>{dateOfBirthError}</Text> : null}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Time (Optional)</Text>
            <TouchableOpacity
              style={[styles.dateInput, birthTimeError ? styles.inputError : null]}
              onPress={() => setShowTimePicker(true)}
              accessibilityLabel="Birth time selector"
              accessibilityRole="button"
            >
              <Text style={birthTime ? styles.dateText : styles.placeholderText}>
                {birthTime ? formatTime(birthTime) : 'Select your birth time'}
              </Text>
            </TouchableOpacity>
            {birthTimeError ? <Text style={styles.errorText}>{birthTimeError}</Text> : null}
            {showTimePicker && (
              <DateTimePicker
                value={birthTime || new Date()}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityLabel="Continue button"
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            accessibilityLabel="Skip for now"
            accessibilityRole="button"
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  form: {
    marginTop: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: COLORS.light.text,
  },
  input: {
    backgroundColor: COLORS.light.card,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  dateInput: {
    backgroundColor: COLORS.light.card,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
  },
  placeholderText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.disabled,
  },
  submitButton: {
    backgroundColor: COLORS.light.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  skipButton: {
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  skipButtonText: {
    color: COLORS.light.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
});

export default UserDataCollectionScreen;

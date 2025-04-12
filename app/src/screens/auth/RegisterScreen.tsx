import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from './LoginScreen';
import { registerWithEmail, createUserProfile } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { clearError } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters long
    return password.length >= 8;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString();
  };

  const formatTime = (time: Date | null): string => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleRegister = async () => {
    // Clear any previous errors
    clearError();
    
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!dateOfBirth) {
      Alert.alert('Error', 'Please select your date of birth');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await registerWithEmail(email, password);
      
      // Format date and time for Firestore
      const formattedDate = dateOfBirth.toISOString().split('T')[0];
      const formattedTime = birthTime ? birthTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
      
      // Update user profile with birth date and time
      // Use type assertion to access the Firebase user object
      const firebaseUser = userCredential as any;
      await createUserProfile(firebaseUser.user, formattedDate, formattedTime);
      
      // Navigation will be handled by the auth state change in AuthContext
    } catch (error: any) {
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        // Show alert with option to navigate to login screen
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Would you like to log in instead?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Log In',
              onPress: () => navigation.navigate('Login', { email })
            }
          ]
        );
        setIsLoading(false);
        return;
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="email-input"
              accessibilityLabel="Email input field"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              testID="password-input"
              accessibilityLabel="Password input field"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              testID="confirm-password-input"
              accessibilityLabel="Confirm password input field"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
              accessibilityLabel="Select date of birth"
              accessibilityRole="button"
            >
              <Text style={styles.datePickerText}>{formatDate(dateOfBirth)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Time (Optional)</Text>
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowTimePicker(true)}
              accessibilityLabel="Select birth time"
              accessibilityRole="button"
            >
              <Text style={styles.datePickerText}>{formatTime(birthTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={birthTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
            accessibilityLabel="Register button"
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <SocialAuthButtons 
            onAuthStart={() => clearError()}
            onAuthError={(error) => Alert.alert('Error', error)}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={handleLogin}
              accessibilityLabel="Log in"
              accessibilityRole="button"
            >
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
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
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  datePickerButton: {
    backgroundColor: COLORS.light.card,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  datePickerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
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
  },
  form: {
    marginTop: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.md,
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
  registerButton: {
    backgroundColor: COLORS.light.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  loginText: {
    color: COLORS.light.text,
    fontSize: FONT_SIZES.sm,
  },
  loginLink: {
    color: COLORS.light.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

export default RegisterScreen;

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform,
  Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { signInWithGoogle } from '../../services/auth';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';

// Ensure the browser redirects correctly
WebBrowser.maybeCompleteAuthSession();

interface SocialAuthButtonsProps {
  onAuthStart?: () => void;
  onAuthComplete?: () => void;
  onAuthError?: (error: string) => void;
}

/**
 * Social authentication buttons component
 * Provides Google and Apple sign-in buttons
 */
const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onAuthStart,
  onAuthComplete,
  onAuthError
}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  // Configure Google auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'GOOGLE_WEB_CLIENT_ID', // Replace with your actual client ID
    iosClientId: 'GOOGLE_IOS_CLIENT_ID', // Replace with your actual client ID
    androidClientId: 'GOOGLE_ANDROID_CLIENT_ID', // Replace with your actual client ID
    redirectUri: makeRedirectUri({
      scheme: 'cardy'
    })
  });

  // Handle Google sign-in
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleAuth(id_token);
    } else if (response?.type === 'error') {
      setIsGoogleLoading(false);
      onAuthError?.(response.error?.message || 'Google sign-in failed');
    }
  }, [response]);

  const handleGoogleAuth = async (idToken: string) => {
    try {
      await signInWithGoogle(idToken);
      setIsGoogleLoading(false);
      onAuthComplete?.();
    } catch (error: any) {
      setIsGoogleLoading(false);
      onAuthError?.(error.message || 'Google sign-in failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    onAuthStart?.();
    
    try {
      await promptAsync();
    } catch (error: any) {
      setIsGoogleLoading(false);
      onAuthError?.(error.message || 'Google sign-in failed');
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    onAuthStart?.();
    
    try {
      // Apple Sign In will be implemented in a future update
      // For now, just show a message
      setTimeout(() => {
        setIsAppleLoading(false);
        Alert.alert('Coming Soon', 'Apple Sign In will be available in a future update.');
      }, 500);
    } catch (error: any) {
      setIsAppleLoading(false);
      onAuthError?.(error.message || 'Apple sign-in failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignIn}
          disabled={isGoogleLoading}
          accessibilityLabel="Sign in with Google"
          accessibilityRole="button"
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color={COLORS.light.primary} />
          ) : (
            <Text style={styles.socialButtonText}>Google</Text>
          )}
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAppleSignIn}
            disabled={isAppleLoading}
            accessibilityLabel="Sign in with Apple"
            accessibilityRole="button"
          >
            {isAppleLoading ? (
              <ActivityIndicator size="small" color={COLORS.light.primary} />
            ) : (
              <Text style={styles.socialButtonText}>Apple</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SPACING.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.light.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.light.text,
    fontSize: FONT_SIZES.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  socialButton: {
    backgroundColor: COLORS.light.card,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: COLORS.light.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});

export default SocialAuthButtons;

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  onBackPress?: () => void;
  testID?: string;
}

/**
 * A reusable Header component for screen headers with optional back button and right component
 */
const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  rightComponent,
  style,
  titleStyle,
  subtitleStyle,
  onBackPress,
  testID,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.light.background}
        translucent={false}
      />
      
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Back"
            testID={`${testID}-back-button`}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        
        <View style={[styles.titleContainer, showBackButton && styles.titleWithBack]}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1} ellipsizeMode="tail">
              {subtitle}
            </Text>
          )}
        </View>
        
        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.background,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.light.primary,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleWithBack: {
    marginLeft: 0,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textLight,
    marginTop: 2,
  },
  rightComponent: {
    marginLeft: SPACING.md,
  },
});

export default Header;

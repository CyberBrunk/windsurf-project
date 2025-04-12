import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  testID?: string;
}

/**
 * A reusable Card component that can be used to display content in a card-like container
 */
const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  testID,
}) => {
  const cardStyle = [
    styles.card,
    variant === 'outlined' && styles.outlinedCard,
    variant === 'elevated' && styles.elevatedCard,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress} 
        activeOpacity={0.8}
        testID={testID}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.light.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  },
  outlinedCard: {
    backgroundColor: COLORS.light.card,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    shadowOpacity: 0,
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;

import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native';
import { COLORS, FONT_SIZES } from '../../utils/theme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body2' | 'caption' | 'button';
  color?: 'primary' | 'secondary' | 'text' | 'textLight' | 'error' | 'success' | 'warning';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  style?: TextStyle;
  children: React.ReactNode;
}

/**
 * A reusable Text component for consistent typography throughout the app
 */
const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  align = 'left',
  weight = 'normal',
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        { color: COLORS.light[color], textAlign: align, fontWeight: weight },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
  },
  h1: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  h2: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    marginBottom: 6,
  },
  h3: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: 4,
  },
  h4: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: 2,
  },
  body: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  body2: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  caption: {
    fontSize: FONT_SIZES.xs,
    lineHeight: 16,
  },
  button: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default Text;

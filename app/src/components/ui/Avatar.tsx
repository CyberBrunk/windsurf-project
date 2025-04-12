import React from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  ViewStyle, 
  ImageSourcePropType,
  Text
} from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../utils/theme';

interface AvatarProps {
  source?: ImageSourcePropType;
  size?: number;
  style?: ViewStyle;
  initials?: string;
  borderColor?: string;
  testID?: string;
}

/**
 * A reusable Avatar component that displays either an image or initials
 */
const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 40,
  style,
  initials,
  borderColor,
  testID,
}) => {
  const avatarStyle = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderColor: borderColor || COLORS.light.border,
    },
    style,
  ];

  const textSize = size * 0.4;

  return (
    <View style={avatarStyle} testID={testID}>
      {source ? (
        <Image 
          source={source} 
          style={styles.image} 
          resizeMode="cover"
          accessibilityRole="image"
        />
      ) : initials ? (
        <View style={styles.initialsContainer}>
          <Text 
            style={[
              styles.initials,
              { fontSize: textSize }
            ]}
          >
            {initials}
          </Text>
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    backgroundColor: COLORS.light.background,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light.disabled,
    borderRadius: BORDER_RADIUS.round,
  },
});

export default Avatar;

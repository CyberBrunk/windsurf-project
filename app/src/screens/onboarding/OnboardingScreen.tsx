import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  SafeAreaView,
  ViewToken
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Define the onboarding steps
const onboardingSteps = [
  {
    id: '1',
    title: 'Welcome to Cardy',
    description: 'Your personal flashcard app for effective learning with spaced repetition.',
    image: '🎉', // We'll use emojis for now, but these could be replaced with actual images
  },
  {
    id: '2',
    title: 'Create Flashcard Decks',
    description: 'Organize your learning material into decks for different subjects or topics.',
    image: '📚',
  },
  {
    id: '3',
    title: 'Study with Spaced Repetition',
    description: 'Cardy uses spaced repetition to help you remember information more effectively.',
    image: '🧠',
  },
  {
    id: '4',
    title: 'Track Your Progress',
    description: 'Monitor your learning progress and see how you improve over time.',
    image: '📈',
  },
];

/**
 * OnboardingScreen component - Introduces the app to new users
 */
const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Handle when a slide becomes visible
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Navigate to the next slide
  const goToNextSlide = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // If we're on the last slide, navigate to the user data collection screen
      navigation.navigate('UserDataCollection');
    }
  };

  // Skip the onboarding process
  const handleSkip = () => {
    navigation.navigate('UserDataCollection');
  };

  // Render an individual slide
  const renderSlide = ({ item }: { item: typeof onboardingSteps[0] }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.image}>{item.image}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  // Render pagination dots
  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingSteps.map((_, index) => {
          const inputRange = [
            (index - 1) * Dimensions.get('window').width,
            index * Dimensions.get('window').width,
            (index + 1) * Dimensions.get('window').width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor:
                    index === currentIndex
                      ? COLORS.light.primary
                      : COLORS.light.border,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity
          onPress={handleSkip}
          accessibilityLabel="Skip onboarding"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {renderPaginationDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={goToNextSlide}
          accessibilityLabel={
            currentIndex === onboardingSteps.length - 1 ? 'Get Started' : 'Next'
          }
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {currentIndex === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  skipText: {
    color: COLORS.light.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  image: {
    fontSize: 80,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.light.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.light.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default OnboardingScreen;

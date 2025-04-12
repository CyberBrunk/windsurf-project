import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import tab screens from index
import {
  TodayScreen,
  ConnectionsScreen,
  ReflectionsScreen,
  PlanetaryPathScreen,
  ChatScreen
} from '../screens/tabs';

// Define the tab navigator param list
export type TabParamList = {
  Today: undefined;
  Connections: undefined;
  Reflections: undefined;
  PlanetaryPath: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Custom tab bar icon component
 */
interface TabBarIconProps {
  focused: boolean;
  name: string;
  icon: React.ReactNode;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, name, icon }) => {
  return (
    <View style={styles.tabIconContainer}>
      {icon}
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{name}</Text>
    </View>
  );
};

/**
 * Main tab navigator component
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.light.primary,
        tabBarInactiveTintColor: COLORS.light.textLight,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Today" 
        component={TodayScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="Today" 
              icon={
                <Ionicons 
                  name="today-outline" 
                  size={24} 
                  color={focused ? COLORS.light.primary : COLORS.light.textLight} 
                />
              } 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Connections" 
        component={ConnectionsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="Connect" 
              icon={
                <Ionicons 
                  name="people-outline" 
                  size={24} 
                  color={focused ? COLORS.light.primary : COLORS.light.textLight} 
                />
              } 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Reflections" 
        component={ReflectionsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="Reflect" 
              icon={
                <Ionicons 
                  name="journal-outline" 
                  size={24} 
                  color={focused ? COLORS.light.primary : COLORS.light.textLight} 
                />
              } 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="PlanetaryPath" 
        component={PlanetaryPathScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="Path" 
              icon={
                <Ionicons 
                  name="star-outline" 
                  size={24} 
                  color={focused ? COLORS.light.primary : COLORS.light.textLight} 
                />
              } 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="Chat" 
              icon={
                <Ionicons 
                  name="chatbubble-outline" 
                  size={24} 
                  color={focused ? COLORS.light.primary : COLORS.light.textLight} 
                />
              } 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.light.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65, // Fixed width to prevent wrapping
    paddingHorizontal: 2,
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  tabLabelFocused: {
    fontWeight: '700',
    color: COLORS.light.primary,
  },
});

export default TabNavigator;

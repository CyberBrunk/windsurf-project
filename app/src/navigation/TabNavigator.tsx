import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

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
  icon: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, name, icon }) => {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{name}</Text>
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
      }}
    >
      <Tab.Screen 
        name="Today" 
        component={TodayScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Today" icon="📚" />
          ),
        }}
      />
      <Tab.Screen 
        name="Connections" 
        component={ConnectionsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Connect" icon="👥" />
          ),
        }}
      />
      <Tab.Screen 
        name="Reflections" 
        component={ReflectionsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Reflect" icon="📝" />
          ),
        }}
      />
      <Tab.Screen 
        name="PlanetaryPath" 
        component={PlanetaryPathScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Path" icon="🌟" />
          ),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="Chat" icon="💬" />
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
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  tabLabelFocused: {
    fontWeight: '700',
    color: COLORS.light.primary,
  },
});

export default TabNavigator;

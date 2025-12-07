import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import UserProfileScreen from './UserProfileScreenUpdated';
import SkinAnalysisScreen from './SkinAnalysisScreen';
import CameraAnalysisScreen from './CameraAnalysisScreen';
import DashboardScreen from './DashboardScreen';
import CommunityFeedScreen from './CommunityFeedScreen';
import CommunityMatchingScreen from './CommunityMatchingScreen';
import ProductRecommendationsScreen from './ProductRecommendationsScreen';
import RoutineTrackerScreen from './RoutineTrackerScreen';
import LanguageSettingsScreen from './LanguageSettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarActiveTintColor: '#4A90A4',
        tabBarInactiveTintColor: '#6B6B6B',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => '🏠',
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={ProductRecommendationsScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: () => '✨',
        }}
      />
      <Tab.Screen 
        name="Routine" 
        component={RoutineTrackerScreen}
        options={{
          tabBarLabel: 'Routine',
          tabBarIcon: () => '📝',
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityFeedScreen}
        options={{
          tabBarLabel: 'Community',
          tabBarIcon: () => '👥',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen 
          name="Profile" 
          component={UserProfileScreen}
          options={{ title: 'Create Your Profile' }}
        />
        <Stack.Screen 
          name="SkinAnalysis" 
          component={SkinAnalysisScreen}
          options={{ title: 'Skin Analysis' }}
        />
        <Stack.Screen 
          name="CameraAnalysis" 
          component={CameraAnalysisScreen}
          options={{ title: 'AI Skin Analysis' }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CommunityMatching" 
          component={CommunityMatchingScreen}
          options={{ title: 'Find Your Tribe' }}
        />
        <Stack.Screen 
          name="LanguageSettings" 
          component={LanguageSettingsScreen}
          options={{ title: 'Language Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
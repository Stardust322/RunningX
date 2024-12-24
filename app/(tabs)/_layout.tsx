import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, Dimensions, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SelectionProvider } from '../../components/SelectionContext'; // Context 불러오기
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SelectionProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="home-outline" color={color} />
            ),
          }}
        />
      
        <Tabs.Screen
          name="run"
          options={{
            title: 'Run',
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="walk-outline" color={"#00D66B"} />
            ),
          }}
        />
        <Tabs.Screen
          name="direction"
          options={{
            title: 'Navigate',
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="navigate-circle-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: 'Setting',
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="settings-outline" color={color} />
            ),
          }}
        />
        
      </Tabs>
    </SelectionProvider>
  );
}

const styles = StyleSheet.create({
  runButton: {
    position: 'absolute',
    bottom: 20,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00D66B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
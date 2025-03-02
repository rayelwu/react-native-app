import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';

// Custom tab button component for the middle tab
function CustomTabButton(props: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.customTabButton}
      onPress={() => router.push('/create')}
    >
      <View style={styles.customTabButtonInner}>
        <FontAwesome name="plus" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: 10,
          ...Platform.select({
            // Use a transparent background on iOS to show the blur effect
            ios: {
              position: 'absolute',
            },
            default: {},
          })
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => <FontAwesome size={20} name="comments" color={focused ? '#0088ff' :  color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, focused }) => <FontAwesome size={20} name="list" color={focused ? '#0088ff' : color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => <FontAwesome size={20} name="user" color={focused ? '#0088ff' : color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customTabButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTabButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0088ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

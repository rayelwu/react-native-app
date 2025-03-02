import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter } from 'expo-router';
const profile = require('@/assets/data/profile.json');

export default function TabTwoScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image source={require('@/assets/images/fruit-1.jpg')} style={styles.headerImage} />
      }>
      <ThemedView style={styles.titleContainer}>
        <Image source={require('@/assets/images/avatar.jpg')} style={styles.avatar} />
        <ThemedText type="title">{profile.name}</ThemedText>
      </ThemedView>
      <ThemedText> <FontAwesome name="user" size={16} color="#a1a1a1" /> {profile.bio}</ThemedText>
      <ThemedText> <FontAwesome name="map-marker" size={16} color="#a1a1a1" /> {profile.location}</ThemedText>
      <ThemedText> <FontAwesome name="globe" size={16} color="#a1a1a1" /> {profile.website}</ThemedText>
      <ThemedText> <FontAwesome name="envelope" size={16} color="#a1a1a1" /> {profile.email}</ThemedText>
      <ThemedText> <FontAwesome name="phone" size={16} color="#a1a1a1" /> {profile.phone}</ThemedText>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#0088ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
  },
});

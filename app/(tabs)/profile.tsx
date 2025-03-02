import { StyleSheet, Image, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const profile = require('@/assets/data/profile.json');

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image source={require('@/assets/images/fruit-1.jpg')} style={styles.headerImage} />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{profile.name}</ThemedText>
      </ThemedView>
      <ThemedText>{profile.bio}</ThemedText>
      <ThemedText> <FontAwesome name="map-marker" size={16} color="#a1a1a1" /> {profile.location}</ThemedText>
      <ThemedText> <FontAwesome name="globe" size={16} color="#a1a1a1" /> {profile.website}</ThemedText>
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
    gap: 8,
  },
});

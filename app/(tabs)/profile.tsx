import { StyleSheet, Image, Platform, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter } from 'expo-router';
const profile = require('@/assets/data/profile.json');

export default function TabTwoScreen() {
  const router = useRouter();
  const [avatarImage, setAvatarImage] = useState(require('@/assets/images/avatar.jpg'));
  const [headerImage, setHeaderImage] = useState(require('@/assets/images/fruit-1.jpg'));

  const handleLogout = () => {
    router.replace('/login');
  };

  const pickImage = async () => {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // 打开图片选择器
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarImage({ uri: result.assets[0].uri });
    }
  };

  const pickHeaderImage = async () => {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // 打开图片选择器
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setHeaderImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <Image source={headerImage} style={styles.headerImage} />
          <TouchableOpacity style={styles.headerEditButton} onPress={pickHeaderImage}>
            <FontAwesome name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <View style={styles.avatarContainer}>
          <Image source={avatarImage} style={styles.avatar} />
          <TouchableOpacity style={styles.avatarEditButton} onPress={pickImage}>
            <FontAwesome name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
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
  headerImageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  headerImage: {
    position: 'absolute',
  //  bottom: -90,
    //left: -35,
    width: '100%',
    height: '100%',
  },
  headerEditButton: {
    position: 'absolute',
    right: 20,
    top: 40,
    backgroundColor: 'rgba(0, 136, 255, 0.8)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  avatarEditButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: '#0088ff',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
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

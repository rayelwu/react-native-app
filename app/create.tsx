import { StyleSheet, Image, Platform, TextInput, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import SelectInput from '@/components/ui/SelectInput';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function CreateScreen() {

  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Leader']);
  const [avatarImage, setAvatarImage] = useState(require('@/assets/images/fruit-4.jpg'));

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

  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff'}}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#0088ff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>New Member</Text>
        <TouchableOpacity
          style={{}}
        >
          <Text style={{
            color: '#0088ff',
            fontWeight: '500',
          }}>Create</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>

        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', gap: 10, padding: 16}}>
          <ThemedText type='default'>Avatar</ThemedText>
          <View style={styles.avatarContainer}>
            <Image source={avatarImage} style={styles.avatar} />
            <TouchableOpacity style={styles.avatarEditButton} onPress={pickImage}>
              <FontAwesome name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <ThemedText type='default'>Name</ThemedText>
          <TextInput
            style={{
              backgroundColor: '#f1f1f1',
              padding: 10,
              borderRadius: 10,
            }}
            placeholder="Please enter content"
          />

          <ThemedText type='default'>Type</ThemedText>
          <SelectInput options={['Leader', 'Android', 'iOS', 'Web', 'PM', 'QA'].map(item => ({
            key: item,
            label: item,
            value: item,
          }))} selected={selectedRoles} onSelect={(option) => {
            setSelectedRoles(option);
          }} />
          <ThemedText type='default'>Responsibility</ThemedText>
          <TextInput
            style={{
              backgroundColor: '#f1f1f1',
              padding: 10,
              borderRadius: 10,
              height: 200,
              textAlignVertical: 'top',
            }}
            multiline={true}
            numberOfLines={10}
            placeholder="Please enter content" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
  },
  createButton: {
    padding: 10,
  },
  createButtonText: {
    fontSize: 20,
    color: '#0088ff',
    fontWeight: '500',
  },
  createButtonDisabled: {
    color: '#ccc',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
  },
  selectInput: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#0088ff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

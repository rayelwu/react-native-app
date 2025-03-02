import { StyleSheet, Image, Platform, TextInput, View, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import SelectInput from '@/components/ui/SelectInput';
import { useState } from 'react';


export default function CreateScreen() {

  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Leader']);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image source={require('@/assets/images/fruit-6.jpg')} style={{ alignSelf: 'center', width: '100%', height: "100%" }} />
      }>

      <ThemedText type='default'>Avatar</ThemedText>
      <Image source={require('@/assets/images/fruit-4.jpg')} style={{ alignSelf: 'flex-start', width: 100, height: 100, borderRadius: 100 }} />

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
          height: 100,
          textAlignVertical: 'top',
        }}
        multiline={true}
        numberOfLines={4}
        placeholder="Please enter content" />
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
});

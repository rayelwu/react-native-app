import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import SearchBox from '@/components/SearchBox';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
const messageData = require('@/assets/data/messages-unread.json');
const userData = require('@/assets/data/users.json');
const teamData = require('@/assets/data/teams.json');

export default function ChatScreen() {
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(messageData.map((message: any) => ({
    ...message,
    sender: userData.find((user: any) => user.id === message.sender_id)
      ?? teamData.find((team: any) => team.id === message.sender_id),
  })).filter((message: any) => !!message.sender));
  const [filteredMessages, setFilteredMessages] = useState(unreadMessages);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate network request or data loading
    setTimeout(() => {
      // Add actual data loading logic here
      setRefreshing(false);
    }, 2000);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = unreadMessages.filter((message: any) =>
        message.text.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(unreadMessages);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', backgroundColor: 'white', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>

          <SearchBox
            onSearch={handleSearch}
          />
          <ThemedText style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', }}>
            Messages
          </ThemedText>

          <TouchableOpacity style={{}} onPress={() => router.push('/create')}>
            <FontAwesome name="plus" size={24} color="#0088ff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredMessages}
          showsVerticalScrollIndicator
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.messageItem}
              onPress={() => router.push({
                pathname: '/chat',
                params: { ...item }
              })}
            >

              <Image source={{ uri: item.sender.avatar }} style={styles.avatar} />

              <View style={styles.messageContainer}>
                <View style={styles.messageHeader}>
                  <Text style={styles.contactName}>{item.sender.name}</Text>
                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
                <View style={styles.messageSummary}>
                  <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">{item.text}</Text>
                  {item.messageCountUnread > 0 && (
                    <Text style={styles.messageBubble} >
                      {item.messageCountUnread}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          style={styles.messageList}
          contentContainerStyle={{ paddingVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          bounces={true}
          bouncesZoom={true}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 2,
    gap: 4,
    flexDirection: 'column',
  },
  messageSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  messageBubble: {
    width: 20,
    height: 20,
    fontSize: 10,
    borderRadius: 15,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 20,
    backgroundColor: '#0088ff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    width: '80%',
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: '#ffffff',
  },
  voiceNoteContainer: {
    padding: 10,
    alignItems: 'center',
  },
  voiceNoteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    borderRadius: 20,
    padding: 10,
  },
  voiceButtonText: {
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#0088ff',
    borderRadius: 20,
    padding: 10,
  },
}); 
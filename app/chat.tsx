import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, Text, Image } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const who = 'lisi';
const messagesHistoryData = require('@/assets/data/messages-history.json');

export default function DetailScreen() {
    const params = useLocalSearchParams();
    const { sender } = params;


    const chatMessages = messagesHistoryData.filter((item: any) =>
        (item.sender === who && item.receiver === sender) ||
        (item.sender === sender && item.receiver === who)
    ).map((item: any) => ({
        id: item.id,
        text: item.text,
        time: item.time,
        sender: item.sender,
        receiver: item.receiver,
        isUser: item.sender === who,
    }));


    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.headerText}>{sender || ''}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <FontAwesome name="ellipsis-v" size={24} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={chatMessages}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item: message }) => (
                    <View style={{
                        flexDirection: message.isUser ? 'row-reverse' : 'row',
                        flex: 1,
                        gap: 10,
                    }}>
                        <Image source={require('@/assets/images/avatar.jpg')} style={styles.avatar} />
                        <View style={{ flexDirection: 'column', gap: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                {!message.isUser ? <Text style={{ fontSize: 12, color: '#888', textAlign: message.isUser ? 'right' : 'left' }}>{message.sender}</Text> : null}
                                <Text style={{ fontSize: 12, color: '#888', textAlign: message.isUser ? 'right' : 'left' }}>{message.time}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    {
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        maxWidth: 200,
                                        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                                    },
                                ]}
                            >
                                <ThemedText style={{
                                    color: message.isUser ? '#fff' : '#000',
                                    backgroundColor: message.isUser ? '#0088ff' : '#ECECEC',
                                    padding: 10,
                                    borderRadius: 15,
                                    borderTopRightRadius: message.isUser ? 3 : 20,
                                    borderTopLeftRadius: message.isUser ? 20 : 3,
                                    fontSize: 14,
                                }}>{message.text}</ThemedText>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
                style={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <View style={styles.attachmentContainer}>
                    <FontAwesome name="paperclip" size={20} color="#888" />
                </View>
                <TextInput style={styles.input} placeholder="Type Message" placeholderTextColor="#888" />
                <TouchableOpacity style={styles.sendButton}>
                    <FontAwesome name="paper-plane" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 50,
    },
    chatContainer: {
        flex: 1,
        marginBottom: 10,
        padding: 10,
    },
    messageRow: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 5,
    },
    userMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        //    maxWidth: '70%',
        padding: 10,
        borderRadius: 15,
    },
    userBubble: {
        backgroundColor: '#0088ff',
        color: '#fff',
        borderTopRightRadius: 5,
        marginLeft: 5,
    },
    otherBubble: {
        backgroundColor: '#ECECEC',
        borderTopLeftRadius: 5,
        marginRight: 5,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    link: {
        alignSelf: 'center',
        marginTop: 10,
        paddingVertical: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 10,
    },
    sendButton: {
        backgroundColor: '#0088ff',
        padding: 10,
        borderRadius: 10,
    },
    sendButtonText: {
        color: '#fff',
    },
    backButton: {
        position: 'absolute',
        left: 10,
    },
    backButtonText: {
        color: '#000',
    },
    moreButton: {
        position: 'absolute',
        right: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerTitle: {
        textAlign: 'center',
    },
    attachmentContainer: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10,
    },
    attachmentText: {
        color: '#888',
    },
});

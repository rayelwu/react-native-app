import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TextInputBox from '@/components/SearchBox';
import UserListItem from '@/components/UserListItem';

type Contact = {
    id: string;
    name: string;
    avatar: string;
    selected: boolean;
};

const userData = require('@/assets/data/users.json');

export default function CreateGroupScreen() {
    const router = useRouter();
    const [groupName, setGroupName] = useState('');
    const [contacts, setContacts] = useState<Contact[]>(
        userData.map((user: any) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            selected: false
        }))
    );
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);

    const toggleContact = (id: string) => {
        setContacts(contacts.map(contact =>
            contact.id === id ? { ...contact, selected: !contact.selected } : contact
        ));
    };

    // Update filtered contacts when contacts change (e.g., when selection changes)
    useEffect(() => {
        setFilteredContacts(contacts);
    }, [contacts]);

    const createGroup = () => {
        // Here you would typically save the new group to your data store
        // For now, we'll just navigate back
        router.back();
    };

    const handleSearch = (text: string) => {
        if (text) {
            const filtered = contacts.filter(contact =>
                contact.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredContacts(filtered);
        } else {
            setFilteredContacts(contacts);
        }
    };

    const renderContact = ({ item }: { item: Contact }) => (
        <UserListItem
            id={item.id}
            name={item.name}
            avatar={item.avatar}
            selected={item.selected}
            showSwitch={true}
            onPress={toggleContact}
        />
    );

    const selectedCount = contacts.filter(c => c.selected).length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color="#0088ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create New Group</Text>
                <TouchableOpacity
                    style={{}}
                    disabled={!groupName || selectedCount === 0}
                    onPress={createGroup}
                >
                    <Text style={{
                        color: !groupName || selectedCount === 0 ? '#ccc' : '#0088ff',
                        fontWeight: '500',
                    }}>Create</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Group Name</Text>
                    <TextInput
                        style={styles.input}
                        value={groupName}
                        onChangeText={setGroupName}
                        placeholder="Please enter group name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.membersContainer}>
                    <View style={styles.membersHeader}>
                        <Text style={styles.label}>Select Members ({selectedCount})</Text>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextInputBox onSearch={handleSearch} alwaysShow={true} style={{
                            backgroundColor: '#fff',
                        }} />
                    </View>

                    <FlatList
                        data={filteredContacts}
                        renderItem={renderContact}
                        keyExtractor={(item) => item.id}
                        style={styles.contactsList}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8fa',
    },
    header: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e4e8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 5,
    },
    createButton: {
        color: '#0088ff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    disabledButton: {
        color: '#cccccc',
    },
    createButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    membersContainer: {
        flex: 1,
    },
    membersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    searchContainer: {
        marginBottom: 10,
    },
    contactsList: {
        flex: 1,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    contactName: {
        fontSize: 16,
        flex: 1,
    },
}); 
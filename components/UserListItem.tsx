import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View, Switch } from 'react-native';

interface UserListItemProps {
    id: string;
    name: string;
    avatar: string;
    onPress: (id: string) => void;
    selected?: boolean;
    showSwitch?: boolean;
    status?: string;
    subtitle?: string;
}

export default function UserListItem({
    id,
    name,
    avatar,
    onPress,
    selected = false,
    showSwitch = false,
    status,
    subtitle
}: UserListItemProps) {
    return (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => onPress(id)}
        >
            <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                defaultSource={require('@/assets/images/avatar.jpg')}
            />
            <View style={styles.contentContainer}>
                <Text style={styles.contactName}>{name}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {showSwitch && (
                <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: selected ? '#0088ff' : '#fff',
                    borderWidth: selected ? 0 : 2,
                    borderColor: selected ? '#0088ff' : '#f1f1f1',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <FontAwesome name="check" size={16} color="#fff" />
                </View>

            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    contactName: {
        fontSize: 16,
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 14,
        color: '#6E7781',
        marginTop: 2,
    },
    status: {
        fontSize: 14,
        marginTop: 2,
    }
}); 
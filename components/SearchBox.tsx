import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SearchBoxProps {
    onSearch?: (text: string) => void;
    alwaysShow?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function SearchBox({ onSearch, alwaysShow = false, style }: SearchBoxProps) {
    const [isSearchVisible, setSearchVisible] = useState(alwaysShow);
    const searchAnim = useRef(new Animated.Value(0)).current;
    const [searchText, setSearchText] = useState('');

    const handleSearchButtonPress = () => {
        setSearchVisible(true);
        Animated.timing(searchAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleSearchInputBlur = () => {
        Animated.timing(searchAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setSearchVisible(false));
    };

    const handleClearSearch = () => {
        setSearchText('');
        if (onSearch) {
            onSearch('');
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        if (onSearch) {
            onSearch(text);
        }
    };

    const searchInputOpacity = searchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={[styles.header, style]}>
            {isSearchVisible ? (
                <Animated.View style={{ opacity: isSearchVisible ? 1 : searchInputOpacity, width: '100%' }}>
                    <View style={[styles.searchInputContainer, style]}>
                        <FontAwesome name="search" size={18} color={'#d1d1d1'} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            onBlur={() => {
                                if (!alwaysShow) {
                                    handleSearchInputBlur();
                                }
                            }}
                            autoFocus
                            value={searchText}
                            onChangeText={handleSearchChange}
                        />
                        {
                            searchText.length > 0 && (
                                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                                    <FontAwesome name="close" size={12} color={'#fff'} />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </Animated.View>
            ) : (
                <View style={styles.headerTextContainer}>
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
                        <FontAwesome name="search" size={18} color={'#000'} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
    },
    headerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 40,
        height: 40,
        gap: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchButton: {
        padding: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        height: 40,
    },
    clearButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d1d1d1',
        borderRadius: 20,
        width: 20,
        height: 20,
    },
}); 
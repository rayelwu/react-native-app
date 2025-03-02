import { ScrollView, View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { useState } from "react";

interface SelectOption {
    key: string;
    label: string;
    value: string;
}
interface SelectInputProps {
    options: SelectOption[];
    selected: string[];
    multiple?: boolean;
    onSelect: (option: string[]) => void;
}

export default function SelectInput({ options, selected, onSelect, multiple = false }: SelectInputProps) {
    // 如果点击选中项，则取消选中
    const handleSelect = (option: SelectOption) => {
        if (multiple) {
            if (selected.includes(option.key)) {
                onSelect(selected.filter(item => item !== option.key));
            } else {
                onSelect([...selected, option.key]);
            }
        } else {
            onSelect([option.key]);
        }
    }
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            fadingEdgeLength={10}
            style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5 }}
        >
            <View style={{ flex: 1, flexDirection: 'row', gap: 10, borderRadius: 10 }}>
                {options.map((option) => (
                    <ThemedText key={option.key} type='small' style={{
                        backgroundColor: selected.includes(option.key) ? '#000' : '#fff',
                        padding: 8,
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                        borderWidth: 1,
                        borderColor: '#f1f1f1',
                        color: selected.includes(option.key) ? '#fff' : '#000',
                    }} onPress={() => handleSelect(option)}>{option.label}</ThemedText>
                ))}
            </View>
        </ScrollView>
    )
}
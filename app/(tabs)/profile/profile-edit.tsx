import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// --- API Mock ---
const saveSectionData = async (sectionKey: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
    console.log(`Saved ${sectionKey}:`, data);
    return true;
};

// --- Field Configuration ---
// This map defines what fields show up for each section
const FIELD_CONFIG = {
    basic: [
        { key: 'fullName', label: 'Full Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text', keyboard: 'email-address' },
        { key: 'phone', label: 'Phone number', type: 'text', keyboard: 'phone-pad' },
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'dob', label: 'Date of birth', type: 'date' },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { key: 'relationshipStatus', label: 'Relationship status', type: 'select', options: ['Single', 'Married', 'Divorced'] },
        { key: 'relationshipType', label: 'Relationship type', type: 'select', options: ['Fun', 'Serious', 'Friends'] },
        { key: 'workStatus', label: 'Work status', type: 'select', options: ['Employed', 'Student', 'Unemployed'] },
    ],
    looks: [
        { key: 'height', label: 'Height', type: 'text' },
        { key: 'ethnicity', label: 'Ethnicity', type: 'select', options: ['Black', 'White', 'Asian', 'Hispanic'] },
        { key: 'bodyType', label: 'Body Type', type: 'select', options: ['Slim', 'Athletic', 'Average', 'Curvy'] },
        { key: 'hairColor', label: 'Hair Color', type: 'text' },
    ],
    personality: [
        { key: 'nature', label: 'Nature', type: 'select', options: ['Introvert', 'Extrovert', 'Ambivert'] },
        { key: 'friends', label: 'Friends', type: 'text' },
        { key: 'children', label: 'Children', type: 'select', options: ['None', 'Have children', 'Want children'] },
        { key: 'pets', label: 'Pets', type: 'text' },
    ],
    lifestyle: [
        { key: 'religion', label: 'Religion', type: 'text' },
        { key: 'car', label: 'Car', type: 'text' },
        { key: 'livingWith', label: 'I live with', type: 'text' },
        { key: 'travel', label: 'Travel', type: 'select', options: ['Rarely', 'Often', 'Always'] },
        { key: 'smoke', label: 'Smoke', type: 'select', options: ['No', 'Yes', 'Socially'] },
        { key: 'drink', label: 'Drink', type: 'select', options: ['No', 'Yes', 'Socially'] },
    ]
};

// --- Custom Input Components ---

const CustomTextInput = ({ label, value, onChange, keyboardType = 'default' }: any) => (
    <View className="mb-5">
        <Text className="text-base font-bold text-black mb-2">{label}</Text>
        <View className="bg-gray-100 rounded-xl px-4 py-3.5">
            <TextInput
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
                className="text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
            />
        </View>
    </View>
);

const CustomSelect = ({ label, value, onChange, options }: any) => (
    <View className="mb-5">
        <Text className="text-base font-bold text-black mb-2">{label}</Text>
        {/* In a real app, this would open a Modal or ActionSheet. Using a simple toggle loop for demo */}
        <TouchableOpacity 
            className="bg-gray-100 rounded-xl px-4 py-4 flex-row justify-between items-center"
            onPress={() => {
                const currentIndex = options.indexOf(value);
                const nextIndex = (currentIndex + 1) % options.length;
                onChange(options[nextIndex]);
            }}
        >
            <Text className={`text-base ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                {value || 'Select'}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
    </View>
);

const CustomDateInput = ({ label, value, onChange }: any) => (
    <View className="mb-5">
        <Text className="text-base font-bold text-black mb-2">{label}</Text>
        <TouchableOpacity className="bg-gray-100 rounded-xl px-4 py-4 flex-row justify-between items-center">
             <Text className="text-base text-gray-800">{value}</Text>
             <Feather name="calendar" size={20} color="#666" />
        </TouchableOpacity>
    </View>
);


export default function ProfileEdit() {
    const navigation = useNavigation();
    const route = useRoute();
    // @ts-ignore
    const { sectionKey, sectionTitle, initialData } = route.params || {};
    
    const [formData, setFormData] = useState(initialData || {});
    const [saving, setSaving] = useState(false);

    const fields = FIELD_CONFIG[sectionKey as keyof typeof FIELD_CONFIG] || [];

    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

   const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Save to server (keep this to ensure backend is updated)
            await saveSectionData(sectionKey, formData);
            
            // 2. Navigate back with the NEW data attached
            // @ts-ignore
            navigation.navigate({
                name: 'ProfileSettings',
                params: { 
                    updatedSection: {
                        key: sectionKey,
                        data: formData
                    }
                },
                merge: true, // Important: merges params into existing screen
            });

        } catch (error) {
            Alert.alert("Error", "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center p-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text className="flex-1 text-center font-bold text-lg mr-8">
                    {sectionTitle || 'Edit Profile'}
                </Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                className="flex-1"
            >
                <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
                    {fields.map((field: any) => {
                        if (field.type === 'select') {
                            return (
                                <CustomSelect
                                    key={field.key}
                                    label={field.label}
                                    value={formData[field.key]}
                                    onChange={(val: string) => handleChange(field.key, val)}
                                    options={field.options}
                                />
                            );
                        }
                        if (field.type === 'date') {
                            return (
                                <CustomDateInput 
                                    key={field.key}
                                    label={field.label}
                                    value={formData[field.key]}
                                    onChange={(val: string) => handleChange(field.key, val)}
                                />
                            );
                        }
                        return (
                            <CustomTextInput
                                key={field.key}
                                label={field.label}
                                value={formData[field.key]}
                                onChange={(val: string) => handleChange(field.key, val)}
                                keyboardType={field.keyboard || 'default'}
                            />
                        );
                    })}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Done Button */}
            <View className="p-5 bg-white border-t border-gray-100 absolute bottom-0 left-0 right-0">
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    <LinearGradient
                        colors={['#D946EF', '#C026D3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="w-full py-4 rounded-full items-center justify-center"
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-lg font-bold">Done</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
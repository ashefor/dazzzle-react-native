import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

export type PhotoStatus = 'empty' | 'uploading' | 'filled' | 'error';

interface PhotoSlot {
  id: string; // Unique ID for the slot (e.g., 'slot-0', 'slot-1')
  uri?: string;
  status: PhotoStatus;
  progress: number; // 0 to 100
  error?: string;
}

interface PhotoCellProps {
  index: number;
  slot: PhotoSlot;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
  onRetry: (index: number) => void;
}

export const PhotoCell = React.memo(({ index, slot, onAdd, onRemove, onRetry }: PhotoCellProps) => {
  const addPhoto = useCallback(() => onAdd(index), [index, onAdd]);
  const removePhoto = useCallback(() => onRemove(index), [index, onRemove]);
  const retryPhoto = useCallback(() => onRetry(index), [index, onRetry]);
  
  // 1. RENDER: Uploading State
  if (slot.status === 'uploading') {
    return (
      <View className="w-[31%] aspect-square mb-3 bg-gray-100 rounded-xl items-center justify-center border border-gray-200 overflow-hidden relative">
        {slot.uri && (
          <Image
             cachePolicy="memory-disk"
             contentFit="cover"
             source={{ uri: slot.uri }}
             className="absolute w-full h-full opacity-50"
          />
        )}
        <ActivityIndicator color="#D946EF" />
        <Text className="text-xs text-[#D946EF] font-bold mt-1">{slot.progress}%</Text>
      </View>
    );
  }

  // 2. RENDER: Error State
  if (slot.status === 'error') {
    return (
      <TouchableOpacity 
        accessibilityLabel="Retry photo upload"
        accessibilityRole="button"
        onPress={retryPhoto}
        className="w-[31%] aspect-square mb-3 bg-red-50 rounded-xl items-center justify-center border border-red-200"
      >
        <Feather name="alert-circle" size={24} color="#EF4444" />
        <Text className="text-[10px] text-red-500 text-center mt-1 px-1">Failed</Text>
        <Text className="text-[10px] text-red-500 font-bold mt-1">Tap to retry</Text>
      </TouchableOpacity>
    );
  }

  // 3. RENDER: Filled State (Show Image)
  if (slot.status === 'filled' && slot.uri) {
    return (
      <View className="w-[31%] min-h-[120px] aspect-square mb-3 rounded-xl overflow-hidden relative bg-gray-200">
        <Image cachePolicy="memory-disk" contentFit="cover" source={{ uri: slot.uri }} className="w-full h-full" />
        <TouchableOpacity 
          accessibilityLabel="Remove photo"
          accessibilityRole="button"
          hitSlop={8}
          onPress={removePhoto}
          className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-sm"
        >
          <Feather name="x" size={14} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  }

  // 4. RENDER: Empty State (Add Button)
  return (
    <TouchableOpacity 
      accessibilityLabel="Add photo"
      accessibilityRole="button"
      onPress={addPhoto}
      className="w-[31%] min-h-[120px] aspect-square mb-3 bg-gray-100 rounded-xl items-center justify-center border border-dashed border-gray-300"
    >
      <Feather name="plus" size={28} color="#9CA3AF" />
    </TouchableOpacity>
  );
});

PhotoCell.displayName = 'PhotoCell';

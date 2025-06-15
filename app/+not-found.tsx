import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1 items-center justify-center p-5 bg-primary'>
        <Text className='text-white text-base font-firamedium'>Error!</Text>
        <Text className='text-white text-base font-firamedium'>Unfortunately. This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text className='text-white text-sm'>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

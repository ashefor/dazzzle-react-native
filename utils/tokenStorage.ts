import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from '@/constants/constants';

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const parseLegacyToken = (storedValue: string): string | null => {
    try {
        const parsedValue: unknown = JSON.parse(storedValue);
        return typeof parsedValue === 'string' && parsedValue.trim() !== ''
            ? parsedValue
            : null;
    } catch {
        return storedValue.trim() !== '' ? storedValue : null;
    }
};

/**
 * Reads the encrypted token. Existing AsyncStorage tokens are migrated once,
 * then deleted only after the encrypted write succeeds.
 */
export const getAuthToken = async (): Promise<string | null> => {
    const secureToken = await SecureStore.getItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS);
    if (secureToken) {
        return secureToken;
    }

    const legacyStoredToken = await AsyncStorage.getItem(TOKEN_KEY);
    if (legacyStoredToken === null) {
        return null;
    }

    const legacyToken = parseLegacyToken(legacyStoredToken);
    if (!legacyToken) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        return null;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, legacyToken, SECURE_STORE_OPTIONS);
    await AsyncStorage.removeItem(TOKEN_KEY);

    return legacyToken;
};

/** Store authentication tokens only in encrypted device storage. */
export const setAuthToken = async (token: string): Promise<void> => {
    if (token.trim() === '') {
        throw new Error('Cannot store an empty authentication token.');
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token, SECURE_STORE_OPTIONS);
    await AsyncStorage.removeItem(TOKEN_KEY);
};

/** Remove both the encrypted token and any pre-migration legacy copy. */
export const removeAuthToken = async (): Promise<void> => {
    const results = await Promise.allSettled([
        SecureStore.deleteItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS),
        AsyncStorage.removeItem(TOKEN_KEY),
    ]);
    const failedRemoval = results.find(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
    );

    if (failedRemoval) {
        throw failedRemoval.reason;
    }
};

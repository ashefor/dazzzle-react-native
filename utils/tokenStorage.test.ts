import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from '@/constants/constants';
import { getAuthToken, removeAuthToken, setAuthToken } from './tokenStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

const mockedAsyncStorage = jest.mocked(AsyncStorage);
const mockedSecureStore = jest.mocked(SecureStore);

describe('secure authentication token storage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAsyncStorage.getItem.mockResolvedValue(null);
        mockedAsyncStorage.removeItem.mockResolvedValue();
        mockedSecureStore.getItemAsync.mockResolvedValue(null);
        mockedSecureStore.setItemAsync.mockResolvedValue();
        mockedSecureStore.deleteItemAsync.mockResolvedValue();
    });

    it('reads an existing token from SecureStore', async () => {
        mockedSecureStore.getItemAsync.mockResolvedValue('secure-token');

        await expect(getAuthToken()).resolves.toBe('secure-token');
        expect(mockedAsyncStorage.getItem).not.toHaveBeenCalled();
    });

    it('migrates a legacy JSON-encoded AsyncStorage token', async () => {
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify('legacy-token'));

        await expect(getAuthToken()).resolves.toBe('legacy-token');
        expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(
            TOKEN_KEY,
            'legacy-token',
            expect.objectContaining({
                keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            })
        );
        expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('keeps the legacy token when the encrypted migration fails', async () => {
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify('legacy-token'));
        mockedSecureStore.setItemAsync.mockRejectedValue(new Error('secure write failed'));

        await expect(getAuthToken()).rejects.toThrow('secure write failed');
        expect(mockedAsyncStorage.removeItem).not.toHaveBeenCalled();
    });

    it('stores new tokens only in SecureStore and removes legacy copies', async () => {
        await setAuthToken('new-token');

        expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(
            TOKEN_KEY,
            'new-token',
            expect.any(Object)
        );
        expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('removes secure and legacy tokens during logout', async () => {
        await removeAuthToken();

        expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith(
            TOKEN_KEY,
            expect.any(Object)
        );
        expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
});

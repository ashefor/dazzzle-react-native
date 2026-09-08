import { setItem } from './asyncStorage';
import { persistRefreshedAuthToken } from './authToken';

jest.mock('./asyncStorage', () => ({
    setItem: jest.fn().mockResolvedValue(undefined),
}));

const mockedSetItem = jest.mocked(setItem);

describe('persistRefreshedAuthToken', () => {
    beforeEach(() => {
        mockedSetItem.mockClear();
    });

    it('stores and returns a refreshed access token', async () => {
        const token = await persistRefreshedAuthToken({
            additional: { token_refreshed: 'new-token' },
        });

        expect(token).toBe('new-token');
        expect(mockedSetItem).toHaveBeenCalledWith('dazzzle-token', 'new-token');
    });

    it('ignores responses without a refreshed token', async () => {
        await expect(persistRefreshedAuthToken({ data: {} })).resolves.toBeNull();
        await expect(persistRefreshedAuthToken(null)).resolves.toBeNull();

        expect(mockedSetItem).not.toHaveBeenCalled();
    });

    it('ignores empty or non-string refreshed tokens', async () => {
        await expect(persistRefreshedAuthToken({
            additional: { token_refreshed: '   ' },
        })).resolves.toBeNull();
        await expect(persistRefreshedAuthToken({
            additional: { token_refreshed: 123 },
        })).resolves.toBeNull();

        expect(mockedSetItem).not.toHaveBeenCalled();
    });
});

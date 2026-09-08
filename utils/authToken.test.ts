import { persistRefreshedAuthToken } from './authToken';
import { setAuthToken } from './tokenStorage';

jest.mock('./tokenStorage', () => ({
    setAuthToken: jest.fn().mockResolvedValue(undefined),
}));

const mockedSetAuthToken = jest.mocked(setAuthToken);

describe('persistRefreshedAuthToken', () => {
    beforeEach(() => {
        mockedSetAuthToken.mockClear();
    });

    it('stores and returns a refreshed access token', async () => {
        const token = await persistRefreshedAuthToken({
            additional: { token_refreshed: 'new-token' },
        });

        expect(token).toBe('new-token');
        expect(mockedSetAuthToken).toHaveBeenCalledWith('new-token');
    });

    it('ignores responses without a refreshed token', async () => {
        await expect(persistRefreshedAuthToken({ data: {} })).resolves.toBeNull();
        await expect(persistRefreshedAuthToken(null)).resolves.toBeNull();

        expect(mockedSetAuthToken).not.toHaveBeenCalled();
    });

    it('ignores empty or non-string refreshed tokens', async () => {
        await expect(persistRefreshedAuthToken({
            additional: { token_refreshed: '   ' },
        })).resolves.toBeNull();
        await expect(persistRefreshedAuthToken({
            additional: { token_refreshed: 123 },
        })).resolves.toBeNull();

        expect(mockedSetAuthToken).not.toHaveBeenCalled();
    });
});

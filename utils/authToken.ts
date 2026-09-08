import { setAuthToken } from '@/utils/tokenStorage';

/**
 * The API can rotate a still-valid access token in the response metadata.
 * Persist it immediately so the next request does not keep using the old token.
 */
export const persistRefreshedAuthToken = async (
    response: unknown
): Promise<string | null> => {
    if (!response || typeof response !== 'object' || !('additional' in response)) {
        return null;
    }

    const additional = response.additional;
    if (!additional || typeof additional !== 'object' || !('token_refreshed' in additional)) {
        return null;
    }

    const refreshedToken = additional.token_refreshed;

    if (typeof refreshedToken !== 'string' || refreshedToken.trim() === '') {
        return null;
    }

    await setAuthToken(refreshedToken);
    return refreshedToken;
};

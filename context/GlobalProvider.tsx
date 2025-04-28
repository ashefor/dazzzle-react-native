// import { getCurrentUser } from '@/lib/appwrite';
import { getItem } from '@/utils/asyncStorage';
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Text } from 'react-native'

interface IMenuContext {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    token: string;
    setToken: Dispatch<SetStateAction<any>>;
    authState: 'completed' | 'incomplete' | undefined;
    setAuthState: Dispatch<SetStateAction<'completed' | 'incomplete' | undefined>>
}

const GlobalContext = createContext<IMenuContext>({
    isLoading: true,
    setIsLoading: () => { },
    user: null,
    setUser: () => { },
    token: '',
    setToken: () => { },
    authState: undefined,
    setAuthState: () => { }
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [authState, setAuthState] = useState<'completed' | 'incomplete' | undefined>(undefined);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string>('');

    const fetchUserAuthState = async () => {
        try {
            setIsLoading(true);
            const token = await getItem('dazzzle-token');
            const user = await getItem('dazzzle-user');
            if (token) {
                setToken(token);
                setAuthState('completed');
            } else {
                if (user) {
                    setUser(user);
                    setAuthState('incomplete');
                } else {
                    setAuthState(undefined);
                }
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUserAuthState();
    }, [])
    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                isLoading,
                setIsLoading,
                authState,
                setAuthState,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
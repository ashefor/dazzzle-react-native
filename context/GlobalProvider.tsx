// import { getCurrentUser } from '@/lib/appwrite';
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import {Text} from 'react-native'

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

    useEffect(() => {
        setIsLoading(false);
        // getCurrentUser().then((user) => {
        //     if (user) {
        //         setUser(user);
        //         setIsLoggedIn(!!user)
        //     } else {
        //         setIsLoggedIn(false);
        //         setUser(null);
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // }).finally(() => {
        //     setIsLoading(false);
        // })
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
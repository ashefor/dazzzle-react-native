// import { getCurrentUser } from '@/lib/appwrite';
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface IMenuContext {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<IMenuContext>({
    isLoading: true,
    setIsLoading: () => { },
    user: null,
    setUser: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
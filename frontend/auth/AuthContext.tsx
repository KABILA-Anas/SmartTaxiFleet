import React from 'react';
import {useStorageState} from '../services/useStorageState';
import {AuthResponse, LoginUser, User} from "./types";
import AuthService from "../services/AuthService";
import {useRouter} from "expo-router";
import {AUTH_STORE_KEY} from "../constants/api";


const AuthContext = React.createContext<{
    signIn: (user: LoginUser) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    user?: User | null;
    accessToken?: string | null;
    refreshToken?: string | null;
}>({
    signIn: (user: LoginUser) => null,
    signOut: () => null,
    session: null,
    isLoading: false,
    user: null,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState(AUTH_STORE_KEY);
    const router = useRouter()

    const signIn = async ({username, password}: LoginUser) => {
        try {
            const user: LoginUser = {username, password};
            const response = await AuthService.login(user);
            if (response.accessToken) {
                setSession(JSON.stringify(response));
                const role = response.user.authorities[0].authority.split('_')[1].toLowerCase()
                const routerPath: string = `screens/passenger/Home`;
                router.push(routerPath as never);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const signOut = () => {
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
                user: session ? (JSON.parse(session) as AuthResponse).user : null,
                accessToken: session ? (JSON.parse(session) as AuthResponse).accessToken : null,
                refreshToken: session ? (JSON.parse(session) as AuthResponse).refreshToken : null,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, getCurrentUser, login, logout, createAccount, updateUserPreferences } from '@/lib/auth';

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    updatePreferences: (preferences: NonNullable<UserData['preferences']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch (error) {
            console.error('Check user error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(email: string, password: string) {
        try {
            const userData = await login(email, password);
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async function handleLogout() {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async function handleRegister(email: string, password: string, name: string) {
        try {
            const userData = await createAccount(email, password, name);
            setUser(userData);
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    async function handleUpdatePreferences(preferences: NonNullable<UserData['preferences']>) {
        if (!user) return;

        try {
            await updateUserPreferences(user.id, preferences);
            setUser(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    preferences: {
                        ...prev.preferences,
                        ...preferences
                    }
                };
            });
        } catch (error) {
            console.error('Update preferences error:', error);
            throw error;
        }
    }

    const value = {
        user,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        updatePreferences: handleUpdatePreferences,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 
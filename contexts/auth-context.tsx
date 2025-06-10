'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, getCurrentUser, login, logout, createAccount, updateUserPreferences } from '@/lib/auth';
import { isAppwriteConfigured } from '@/lib/appwrite';

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    updatePreferences: (preferences: NonNullable<UserData['preferences']>) => Promise<void>;
    isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfigured] = useState(isAppwriteConfigured());

    useEffect(() => {
        if (isConfigured) {
            checkUser();
        } else {
            console.error('Appwrite is not configured. Please check your environment variables.');
            setIsLoading(false);
        }
    }, [isConfigured]);

    async function checkUser() {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch (error) {
            console.error('Check user error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(email: string, password: string) {
        if (!isConfigured) {
            throw new Error('Appwrite is not configured properly');
        }

        try {
            setIsLoading(true);
            const userData = await login(email, password);
            setUser(userData);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear user state even if logout fails
            setUser(null);
        }
    }

    async function handleRegister(email: string, password: string, name: string) {
        if (!isConfigured) {
            throw new Error('Appwrite is not configured properly');
        }

        try {
            setIsLoading(true);
            const userData = await createAccount(email, password, name);
            setUser(userData);
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
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
        isConfigured,
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
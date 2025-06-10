'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, getCurrentUser, login, logout, createAccount, updateUserPreferences } from '@/lib/auth';
import { isAppwriteConfigured, testAppwriteConnection } from '@/lib/appwrite';

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    updatePreferences: (preferences: NonNullable<UserData['preferences']>) => Promise<void>;
    isConfigured: boolean;
    connectionError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isConfigured] = useState(isAppwriteConfigured());

    useEffect(() => {
        if (isConfigured) {
            checkConnection();
        } else {
            setConnectionError('Appwrite is not configured. Please check your environment variables.');
            setIsLoading(false);
        }
    }, [isConfigured]);

    async function checkConnection() {
        try {
            const connectionTest = await testAppwriteConnection();
            if (!connectionTest.success) {
                setConnectionError(connectionTest.error);
            } else {
                setConnectionError(null);
                await checkUser();
            }
        } catch (error) {
            console.error('Connection check failed:', error);
            setConnectionError('Failed to connect to authentication service');
        } finally {
            setIsLoading(false);
        }
    }

    async function checkUser() {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch (error) {
            console.error('Check user error:', error);
            setUser(null);
        }
    }

    async function handleLogin(email: string, password: string) {
        if (!isConfigured) {
            throw new Error('Authentication service is not configured properly');
        }

        if (connectionError) {
            throw new Error(connectionError);
        }

        try {
            setIsLoading(true);
            const userData = await login(email, password);
            setUser(userData);
            setConnectionError(null);
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
            throw new Error('Authentication service is not configured properly');
        }

        if (connectionError) {
            throw new Error(connectionError);
        }

        try {
            setIsLoading(true);
            const userData = await createAccount(email, password, name);
            setUser(userData);
            setConnectionError(null);
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
        connectionError,
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
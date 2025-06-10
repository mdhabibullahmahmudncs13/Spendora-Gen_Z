import { account, databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { ID, Query } from 'appwrite';

export interface UserData {
    id: string;
    email: string;
    name: string;
    preferences?: {
        currency: string;
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}

export async function createAccount(email: string, password: string, name: string): Promise<UserData> {
    try {
        // Create account
        const user = await account.create(ID.unique(), email, password, name);
        
        // Create user preferences document
        await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
                userId: user.$id,
                email: user.email,
                name: user.name,
                currency: 'USD',
                theme: 'light',
                notifications: true,
            }
        );

        // Log in the user automatically after account creation
        await account.createEmailSession(email, password);

        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences: {
                currency: 'USD',
                theme: 'light',
                notifications: true,
            }
        };
    } catch (error) {
        console.error('Account creation error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create account');
    }
}

export async function login(email: string, password: string): Promise<UserData> {
    try {
        // First, check if there's already an active session and delete it
        try {
            await account.deleteSession('current');
        } catch (sessionError) {
            // Ignore error if no session exists
            console.log('No existing session to delete');
        }

        // Create new session
        const session = await account.createEmailSession(email, password);
        console.log('Session created successfully:', session);
        
        // Get account info
        const user = await account.get();
        console.log('User account retrieved:', user);
        
        // Get user preferences
        const preferences = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('userId', user.$id)]
        );

        const userPrefs = preferences.documents[0];

        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences: userPrefs ? {
                currency: userPrefs.currency || 'USD',
                theme: userPrefs.theme || 'light',
                notifications: userPrefs.notifications !== undefined ? userPrefs.notifications : true,
            } : {
                currency: 'USD',
                theme: 'light',
                notifications: true,
            }
        };
    } catch (error) {
        console.error('Login error details:', error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('Invalid credentials')) {
                throw new Error('Invalid email or password. Please check your credentials and try again.');
            } else if (error.message.includes('user_not_found')) {
                throw new Error('No account found with this email address. Please sign up first.');
            } else if (error.message.includes('user_blocked')) {
                throw new Error('Your account has been temporarily blocked. Please contact support.');
            } else if (error.message.includes('rate_limit')) {
                throw new Error('Too many login attempts. Please wait a few minutes and try again.');
            }
        }
        
        throw new Error('Login failed. Please check your email and password.');
    }
}

export async function logout(): Promise<void> {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error('Logout error:', error);
        // Don't throw error for logout - just log it
    }
}

export async function getCurrentUser(): Promise<UserData | null> {
    try {
        const user = await account.get();
        const preferences = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('userId', user.$id)]
        );

        const userPrefs = preferences.documents[0];

        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences: userPrefs ? {
                currency: userPrefs.currency || 'USD',
                theme: userPrefs.theme || 'light',
                notifications: userPrefs.notifications !== undefined ? userPrefs.notifications : true,
            } : {
                currency: 'USD',
                theme: 'light',
                notifications: true,
            }
        };
    } catch (error) {
        console.log('No current user session');
        return null;
    }
}

export async function updateUserPreferences(
    userId: string,
    preferences: {
        currency?: string;
        theme?: 'light' | 'dark';
        notifications?: boolean;
    }
): Promise<void> {
    try {
        const userDocs = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal('userId', userId)]
        );

        if (userDocs.documents.length > 0) {
            const userDoc = userDocs.documents[0];
            const updateData: any = {};
            
            if (preferences.currency !== undefined) updateData.currency = preferences.currency;
            if (preferences.theme !== undefined) updateData.theme = preferences.theme;
            if (preferences.notifications !== undefined) updateData.notifications = preferences.notifications;
            
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userDoc.$id,
                updateData
            );
        }
    } catch (error) {
        console.error('Update preferences error:', error);
        throw error;
    }
}
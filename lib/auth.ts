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
        
        // Create user preferences document with individual fields instead of nested object
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

        // Log in the user
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
        throw error;
    }
}

export async function login(email: string, password: string): Promise<UserData> {
    try {
        // Create session
        await account.createEmailSession(email, password);
        
        // Get account info
        const user = await account.get();
        
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
        console.error('Login error:', error);
        throw error;
    }
}

export async function logout(): Promise<void> {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
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
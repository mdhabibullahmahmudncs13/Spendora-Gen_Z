import { account, databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { ID } from 'appwrite';

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
                preferences: {
                    currency: 'USD',
                    theme: 'light',
                    notifications: true,
                }
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
            [databases.queries.equal('userId', user.$id)]
        );

        const userPrefs = preferences.documents[0];

        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences: userPrefs?.preferences || {
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
            [databases.queries.equal('userId', user.$id)]
        );

        const userPrefs = preferences.documents[0];

        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences: userPrefs?.preferences || {
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
            [databases.queries.equal('userId', userId)]
        );

        if (userDocs.documents.length > 0) {
            const userDoc = userDocs.documents[0];
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userDoc.$id,
                {
                    preferences: {
                        ...userDoc.preferences,
                        ...preferences
                    }
                }
            );
        }
    } catch (error) {
        console.error('Update preferences error:', error);
        throw error;
    }
} 
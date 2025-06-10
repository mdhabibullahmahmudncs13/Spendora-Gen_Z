import { account, databases, DATABASE_ID, COLLECTIONS, handleAppwriteError } from './appwrite';
import { ID } from 'appwrite';

export interface UserData {
    id: string;
    email: string;
    name: string;
    preferences?: {
        currency: string;
        theme: string;
        notifications: boolean;
    };
}

export async function createAccount(email: string, password: string, name: string): Promise<UserData> {
    try {
        console.log('Creating account for:', email);
        
        // Create account
        const user = await account.create(ID.unique(), email, password, name);
        console.log('Account created:', user);
        
        // Create session
        const session = await account.createEmailSession(email, password);
        console.log('Session created:', session);
        
        // Create user document in database
        const userData = {
            userId: user.$id,
            email: user.email,
            name: user.name,
            preferences: {
                currency: 'USD',
                theme: 'light',
                notifications: true
            }
        };
        
        await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            userData
        );
        
        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences: userData.preferences
        };
    } catch (error: any) {
        console.error('Account creation error details:', error);
        throw new Error(handleAppwriteError(error));
    }
}

export async function login(email: string, password: string): Promise<UserData> {
    try {
        console.log('Attempting login for:', email);
        
        // Create session
        const session = await account.createEmailSession(email, password);
        console.log('Login session created:', session);
        
        // Get user data
        const user = await account.get();
        console.log('User data retrieved:', user);
        
        // Get user preferences from database
        let preferences = {
            currency: 'USD',
            theme: 'light',
            notifications: true
        };
        
        try {
            const userDoc = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [`userId=${user.$id}`]
            );
            
            if (userDoc.documents.length > 0) {
                preferences = userDoc.documents[0].preferences || preferences;
            }
        } catch (prefError) {
            console.warn('Could not load user preferences:', prefError);
        }
        
        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences
        };
    } catch (error: any) {
        console.error('Login error details:', error);
        throw new Error(handleAppwriteError(error));
    }
}

export async function logout(): Promise<void> {
    try {
        await account.deleteSession('current');
    } catch (error: any) {
        console.error('Logout error:', error);
        // Don't throw error for logout failures
    }
}

export async function getCurrentUser(): Promise<UserData | null> {
    try {
        const user = await account.get();
        
        // Get user preferences from database
        let preferences = {
            currency: 'USD',
            theme: 'light',
            notifications: true
        };
        
        try {
            const userDoc = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [`userId=${user.$id}`]
            );
            
            if (userDoc.documents.length > 0) {
                preferences = userDoc.documents[0].preferences || preferences;
            }
        } catch (prefError) {
            console.warn('Could not load user preferences:', prefError);
        }
        
        return {
            id: user.$id,
            email: user.email,
            name: user.name,
            preferences
        };
    } catch (error) {
        console.log('No current user session');
        return null;
    }
}

export async function updateUserPreferences(userId: string, preferences: UserData['preferences']): Promise<void> {
    try {
        // Find user document
        const userDoc = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [`userId=${userId}`]
        );
        
        if (userDoc.documents.length > 0) {
            // Update existing document
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userDoc.documents[0].$id,
                { preferences }
            );
        } else {
            // Create new user document
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                ID.unique(),
                {
                    userId,
                    preferences
                }
            );
        }
    } catch (error: any) {
        console.error('Update preferences error:', error);
        throw new Error(handleAppwriteError(error));
    }
}
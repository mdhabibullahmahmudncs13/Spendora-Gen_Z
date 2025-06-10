import { Client, Account, Databases, Storage, Query } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    console.error('Missing Appwrite configuration. Please check your environment variables:');
    console.error('NEXT_PUBLIC_APPWRITE_ENDPOINT:', endpoint);
    console.error('NEXT_PUBLIC_APPWRITE_PROJECT_ID:', projectId);
}

const client = new Client()
    .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1')
    .setProject(projectId || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export Query for use in other files
export { Query };

// Collection IDs
export const COLLECTIONS = {
    EXPENSES: 'expenses',
    USERS: 'users',
    GOALS: 'goals',
} as const;

// Database ID
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

// Bucket ID for attachments
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '';

// Helper function to check if Appwrite is configured
export const isAppwriteConfigured = () => {
    const isConfigured = !!(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    );
    
    if (!isConfigured) {
        console.warn('Appwrite is not fully configured. Please set all required environment variables.');
    }
    
    return isConfigured;
};

// Test connection function
export const testAppwriteConnection = async () => {
    try {
        await account.get();
        return true;
    } catch (error) {
        console.error('Appwrite connection test failed:', error);
        return false;
    }
};
import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

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
    return !!(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
    );
};
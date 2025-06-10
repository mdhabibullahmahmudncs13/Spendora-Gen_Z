import { Client, Account, Databases, Storage, Query } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!endpoint || !projectId || !databaseId) {
    console.error('Missing Appwrite configuration. Please check your environment variables:');
    console.error('NEXT_PUBLIC_APPWRITE_ENDPOINT:', endpoint);
    console.error('NEXT_PUBLIC_APPWRITE_PROJECT_ID:', projectId);
    console.error('NEXT_PUBLIC_APPWRITE_DATABASE_ID:', databaseId);
}

// Create client with proper configuration
const client = new Client();

if (endpoint && projectId) {
    client
        .setEndpoint(endpoint)
        .setProject(projectId);
} else {
    console.warn('Appwrite client not properly configured due to missing environment variables');
}

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
export const DATABASE_ID = databaseId || '';

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
        console.warn('Required variables:');
        console.warn('- NEXT_PUBLIC_APPWRITE_ENDPOINT');
        console.warn('- NEXT_PUBLIC_APPWRITE_PROJECT_ID');
        console.warn('- NEXT_PUBLIC_APPWRITE_DATABASE_ID');
    }
    
    return isConfigured;
};

// Test connection function with better error handling
export const testAppwriteConnection = async () => {
    try {
        if (!isAppwriteConfigured()) {
            throw new Error('Appwrite is not properly configured');
        }
        
        // Try to get account info to test connection
        // Use a timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout')), 10000);
        });
        
        await Promise.race([account.get(), timeoutPromise]);
        return { success: true, error: null };
    } catch (error: any) {
        console.error('Appwrite connection test failed:', error);
        
        // Provide more specific error messages
        if (error.message === 'Connection timeout') {
            return { success: false, error: 'Connection timeout - check your endpoint URL and network connection' };
        } else if (error.code === 401) {
            return { success: false, error: 'Authentication failed - user not logged in' };
        } else if (error.code === 404) {
            return { success: false, error: 'Appwrite project not found - check your project ID' };
        } else if (error.message?.includes('fetch') || error.name === 'TypeError') {
            return { success: false, error: 'Cannot connect to Appwrite - check your endpoint URL and CORS settings in Appwrite Console' };
        } else if (error.message?.includes('CORS')) {
            return { success: false, error: 'CORS error - add http://localhost:3000 as a web platform in your Appwrite Console' };
        } else {
            return { success: false, error: error.message || 'Unknown connection error' };
        }
    }
};

// Helper function to handle Appwrite errors
export const handleAppwriteError = (error: any): string => {
    console.error('Appwrite error:', error);
    
    if (error.code === 401) {
        return 'Invalid email or password';
    } else if (error.code === 409) {
        return 'An account with this email already exists';
    } else if (error.code === 400) {
        return 'Invalid request. Please check your input';
    } else if (error.message?.includes('fetch')) {
        return 'Cannot connect to server. Please check your internet connection and try again';
    } else if (error.message?.includes('CORS')) {
        return 'Connection blocked. Please contact support';
    } else {
        return error.message || 'An unexpected error occurred';
    }
};
import { databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { ID, Query } from 'appwrite';
import { FinancialGoal } from '@/types';

export async function createGoal(goal: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal> {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.GOALS,
            ID.unique(),
            {
                ...goal,
                targetDate: new Date(goal.targetDate).toISOString(),
                createdAt: new Date().toISOString(),
            }
        );

        return {
            id: response.$id,
            ...goal,
        };
    } catch (error) {
        console.error('Create goal error:', error);
        throw error;
    }
}

export async function getGoals(userId: string): Promise<FinancialGoal[]> {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.GOALS,
            [
                Query.equal('userId', userId),
                Query.orderAsc('targetDate'),
            ]
        );

        return response.documents.map(doc => ({
            id: doc.$id,
            userId: doc.userId,
            title: doc.title,
            description: doc.description,
            targetAmount: doc.targetAmount,
            currentAmount: doc.currentAmount,
            targetDate: doc.targetDate,
            category: doc.category,
            status: doc.status,
            createdAt: doc.createdAt,
        }));
    } catch (error) {
        console.error('Get goals error:', error);
        throw error;
    }
}

export async function updateGoal(id: string, goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
    try {
        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.GOALS,
            id,
            {
                ...goal,
                targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString() : undefined,
            }
        );

        return {
            id: response.$id,
            userId: response.userId,
            title: response.title,
            description: response.description,
            targetAmount: response.targetAmount,
            currentAmount: response.currentAmount,
            targetDate: response.targetDate,
            category: response.category,
            status: response.status,
            createdAt: response.createdAt,
        };
    } catch (error) {
        console.error('Update goal error:', error);
        throw error;
    }
}

export async function deleteGoal(id: string): Promise<void> {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.GOALS,
            id
        );
    } catch (error) {
        console.error('Delete goal error:', error);
        throw error;
    }
}

export async function updateGoalProgress(id: string, amount: number): Promise<FinancialGoal> {
    try {
        const goal = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.GOALS,
            id
        );

        const newAmount = goal.currentAmount + amount;
        const status = newAmount >= goal.targetAmount ? 'completed' : 'in-progress';

        return await updateGoal(id, {
            currentAmount: newAmount,
            status,
        });
    } catch (error) {
        console.error('Update goal progress error:', error);
        throw error;
    }
} 
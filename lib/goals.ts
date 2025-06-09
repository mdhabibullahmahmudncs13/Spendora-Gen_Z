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
                userId: goal.userId || '',
                title: goal.title,
                description: goal.description || '',
                targetAmount: goal.targetAmount,
                currentAmount: goal.currentAmount,
                category: goal.category || '',
                type: goal.type,
                period: goal.period,
                startDate: new Date(goal.startDate).toISOString(),
                endDate: new Date(goal.endDate).toISOString(),
                isActive: goal.isActive,
                createdAt: new Date().toISOString(),
            }
        );

        return {
            id: response.$id,
            userId: response.userId,
            title: response.title,
            description: response.description,
            targetAmount: response.targetAmount,
            currentAmount: response.currentAmount,
            category: response.category,
            type: response.type,
            period: response.period,
            startDate: response.startDate,
            endDate: response.endDate,
            isActive: response.isActive,
            createdAt: response.createdAt,
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
                Query.orderDesc('createdAt'),
            ]
        );

        return response.documents.map(doc => ({
            id: doc.$id,
            userId: doc.userId,
            title: doc.title,
            description: doc.description,
            targetAmount: doc.targetAmount,
            currentAmount: doc.currentAmount,
            category: doc.category,
            type: doc.type,
            period: doc.period,
            startDate: doc.startDate,
            endDate: doc.endDate,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
        }));
    } catch (error) {
        console.error('Get goals error:', error);
        throw error;
    }
}

export async function updateGoal(id: string, goal: Partial<FinancialGoal>): Promise<FinancialGoal> {
    try {
        const updateData: any = {};
        
        if (goal.title !== undefined) updateData.title = goal.title;
        if (goal.description !== undefined) updateData.description = goal.description;
        if (goal.targetAmount !== undefined) updateData.targetAmount = goal.targetAmount;
        if (goal.currentAmount !== undefined) updateData.currentAmount = goal.currentAmount;
        if (goal.category !== undefined) updateData.category = goal.category;
        if (goal.type !== undefined) updateData.type = goal.type;
        if (goal.period !== undefined) updateData.period = goal.period;
        if (goal.isActive !== undefined) updateData.isActive = goal.isActive;
        if (goal.startDate !== undefined) updateData.startDate = new Date(goal.startDate).toISOString();
        if (goal.endDate !== undefined) updateData.endDate = new Date(goal.endDate).toISOString();

        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.GOALS,
            id,
            updateData
        );

        return {
            id: response.$id,
            userId: response.userId,
            title: response.title,
            description: response.description,
            targetAmount: response.targetAmount,
            currentAmount: response.currentAmount,
            category: response.category,
            type: response.type,
            period: response.period,
            startDate: response.startDate,
            endDate: response.endDate,
            isActive: response.isActive,
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
        const isActive = newAmount < goal.targetAmount;

        return await updateGoal(id, {
            currentAmount: newAmount,
            isActive,
        });
    } catch (error) {
        console.error('Update goal progress error:', error);
        throw error;
    }
}
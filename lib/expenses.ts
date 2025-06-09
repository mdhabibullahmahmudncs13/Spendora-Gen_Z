import { databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { ID, Query } from 'appwrite';
import { Expense } from '@/types';

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.EXPENSES,
            ID.unique(),
            {
                userId: expense.userId || '',
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: new Date(expense.date).toISOString(),
                type: expense.type,
                createdAt: new Date(expense.createdAt).toISOString(),
            }
        );

        return {
            id: response.$id,
            userId: response.userId,
            amount: response.amount,
            category: response.category,
            description: response.description,
            date: response.date,
            type: response.type,
            createdAt: response.createdAt,
        };
    } catch (error) {
        console.error('Create expense error:', error);
        throw error;
    }
}

export async function getExpenses(userId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    type?: 'income' | 'expense';
    limit?: number;
}): Promise<Expense[]> {
    try {
        const queries: string[] = [
            Query.equal('userId', userId),
            Query.orderDesc('date'),
        ];

        if (options?.startDate) {
            queries.push(Query.greaterThanEqual('date', options.startDate.toISOString()));
        }

        if (options?.endDate) {
            queries.push(Query.lessThanEqual('date', options.endDate.toISOString()));
        }

        if (options?.category) {
            queries.push(Query.equal('category', options.category));
        }

        if (options?.type) {
            queries.push(Query.equal('type', options.type));
        }

        if (options?.limit) {
            queries.push(Query.limit(options.limit));
        }

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.EXPENSES,
            queries
        );

        return response.documents.map(doc => ({
            id: doc.$id,
            userId: doc.userId,
            type: doc.type,
            amount: doc.amount,
            category: doc.category,
            description: doc.description,
            date: doc.date,
            createdAt: doc.createdAt,
        }));
    } catch (error) {
        console.error('Get expenses error:', error);
        throw error;
    }
}

export async function updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    try {
        const updateData: any = {};
        
        if (expense.amount !== undefined) updateData.amount = expense.amount;
        if (expense.category !== undefined) updateData.category = expense.category;
        if (expense.description !== undefined) updateData.description = expense.description;
        if (expense.type !== undefined) updateData.type = expense.type;
        if (expense.date !== undefined) updateData.date = new Date(expense.date).toISOString();

        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.EXPENSES,
            id,
            updateData
        );

        return {
            id: response.$id,
            userId: response.userId,
            type: response.type,
            amount: response.amount,
            category: response.category,
            description: response.description,
            date: response.date,
            createdAt: response.createdAt,
        };
    } catch (error) {
        console.error('Update expense error:', error);
        throw error;
    }
}

export async function deleteExpense(id: string): Promise<void> {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.EXPENSES,
            id
        );
    } catch (error) {
        console.error('Delete expense error:', error);
        throw error;
    }
}

export async function getExpenseStats(userId: string, startDate: Date, endDate: Date) {
    try {
        const expenses = await getExpenses(userId, { startDate, endDate });
        
        const totalIncome = expenses
            .filter(e => e.type === 'income')
            .reduce((sum, e) => sum + e.amount, 0);
            
        const totalExpenses = expenses
            .filter(e => e.type === 'expense')
            .reduce((sum, e) => sum + e.amount, 0);

        const categoryTotals = expenses
            .filter(e => e.type === 'expense')
            .reduce((acc, e) => {
                acc[e.category] = (acc[e.category] || 0) + e.amount;
                return acc;
            }, {} as Record<string, number>);

        const topCategories = Object.entries(categoryTotals)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: (amount / totalExpenses) * 100
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        return {
            totalIncome,
            totalExpenses,
            netIncome: totalIncome - totalExpenses,
            topCategories,
            savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
        };
    } catch (error) {
        console.error('Get expense stats error:', error);
        throw error;
    }
}
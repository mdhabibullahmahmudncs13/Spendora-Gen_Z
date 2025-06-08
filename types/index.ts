export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface MonthlyReport {
  month: string;
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
  trends: {
    category: string;
    change: number;
  }[];
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Groceries',
  'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
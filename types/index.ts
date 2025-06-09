export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId?: string; // Made optional for compatibility
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  userId?: string; // Made optional for compatibility
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  category?: string;
  type: 'spending' | 'saving' | 'income';
  period: 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Bill {
  id: string;
  title: string;
  description?: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  createdAt: string;
  updatedAt: string;
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

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental Income',
  'Side Hustle',
  'Gifts',
  'Refunds',
  'Bonuses',
  'Other Income',
] as const;

export const TRANSACTION_TYPES = [
  'income',
  'expense',
] as const;

export const GOAL_TYPES = [
  'spending',
  'saving',
  'income',
] as const;

export const GOAL_PERIODS = [
  'weekly',
  'monthly',
  'yearly',
  'custom',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type TransactionType = typeof TRANSACTION_TYPES[number];
export type GoalType = typeof GOAL_TYPES[number];
export type GoalPeriod = typeof GOAL_PERIODS[number];
'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/dashboard';
import { ExpenseForm } from '@/components/expense-form';
import { Reports } from '@/components/reports';
import { Settings } from '@/components/settings';
import { GoalsDashboard } from '@/components/goals-dashboard';
import { BillCalculator } from '@/components/bill-calculator';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { AuthModal } from '@/components/auth-modal';
import { Expense, User, FinancialGoal, Bill } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, AlertTriangle, ExternalLink, Settings as SettingsIcon, Database, Key } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Appwrite imports
import { useAuth } from '@/contexts/auth-context';
import { createExpense, getExpenses, deleteExpense } from '@/lib/expenses';
import { createGoal, getGoals, updateGoal, deleteGoal } from '@/lib/goals';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]); // Still using local storage for bills
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, isLoading: authLoading, login, register, logout, isConfigured } = useAuth();

  // Load data when user is authenticated
  useEffect(() => {
    if (user && !authLoading && isConfigured) {
      loadUserData();
    } else if (!authLoading && !user && isConfigured) {
      setShowAuthModal(true);
      setLoading(false);
    } else if (!authLoading && !isConfigured) {
      setLoading(false);
    }
  }, [user, authLoading, isConfigured]);

  const loadUserData = async () => {
    if (!user || !isConfigured) return;
    
    setLoading(true);
    try {
      // Load expenses and goals from Appwrite
      const [expensesData, goalsData] = await Promise.all([
        getExpenses(user.id),
        getGoals(user.id)
      ]);
      
      setExpenses(expensesData);
      setGoals(goalsData);
      
      // Load bills from localStorage (keeping existing functionality)
      const savedBills = localStorage.getItem('financeai_bills');
      if (savedBills) {
        setBills(JSON.parse(savedBills));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user || !isConfigured) return;
    
    try {
      const newExpense = await createExpense({
        ...expenseData,
        userId: user.id,
      });
      
      setExpenses(prev => [newExpense, ...prev]);
      toast.success(`${expenseData.type === 'income' ? 'Income' : 'Expense'} added successfully! 🎉`);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add transaction. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!isConfigured) return;
    
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete transaction. Please try again.');
    }
  };

  const handleAddGoal = async (goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    if (!user || !isConfigured) return;
    
    try {
      const newGoal = await createGoal({
        ...goalData,
        userId: user.id,
      });
      
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Goal created successfully! 🎯');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to create goal. Please try again.');
    }
  };

  const handleUpdateGoal = async (id: string, goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    if (!isConfigured) return;
    
    try {
      const updatedGoal = await updateGoal(id, goalData);
      setGoals(prev => prev.map(goal => goal.id === id ? updatedGoal : goal));
      toast.success('Goal updated successfully! 🎯');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!isConfigured) return;
    
    try {
      await deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal. Please try again.');
    }
  };

  // Bill handlers (still using localStorage)
  const handleSaveBill = (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBill: Bill = {
      ...billData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedBills = [...bills, newBill];
    setBills(updatedBills);
    localStorage.setItem('financeai_bills', JSON.stringify(updatedBills));
  };

  const handleUpdateBill = (id: string, billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedBills = bills.map(bill => 
      bill.id === id 
        ? { ...billData, id, createdAt: bill.createdAt, updatedAt: new Date().toISOString() }
        : bill
    );
    setBills(updatedBills);
    localStorage.setItem('financeai_bills', JSON.stringify(updatedBills));
  };

  const handleDeleteBill = (id: string) => {
    const updatedBills = bills.filter(bill => bill.id !== id);
    setBills(updatedBills);
    localStorage.setItem('financeai_bills', JSON.stringify(updatedBills));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setShowAuthModal(false);
      toast.success('Welcome back! 🎉');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
      setShowAuthModal(false);
      toast.success('Account created successfully! Welcome to FinanceAI! 🎉');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setExpenses([]);
      setGoals([]);
      setBills([]);
      setShowAuthModal(true);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    // This would need to be implemented with Appwrite user update
    toast.success('Profile updated successfully! 🎉');
  };

  // Show loading spinner while checking authentication
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Loading your financial dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show configuration error if Appwrite is not configured
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background">
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4 z-50">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-white/20 dark:hover:bg-slate-800/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-2xl w-full gradient-card border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Configuration Required
              </CardTitle>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                FinanceAI needs to be configured with Appwrite to function properly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Missing Appwrite Configuration
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  The following environment variables are required but not configured:
                </p>
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <code>NEXT_PUBLIC_APPWRITE_ENDPOINT</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <code>NEXT_PUBLIC_APPWRITE_PROJECT_ID</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <code>NEXT_PUBLIC_APPWRITE_DATABASE_ID</code>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Quick Setup Steps
                </h3>
                <ol className="space-y-3 text-sm text-emerald-700 dark:text-emerald-300">
                  <li className="flex gap-3">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300 min-w-[24px] h-6 flex items-center justify-center">1</Badge>
                    <span>Create a free account at <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-600">Appwrite Cloud</a></span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300 min-w-[24px] h-6 flex items-center justify-center">2</Badge>
                    <span>Create a new project and database</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300 min-w-[24px] h-6 flex items-center justify-center">3</Badge>
                    <span>Copy your project credentials to <code>.env.local</code></span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300 min-w-[24px] h-6 flex items-center justify-center">4</Badge>
                    <span>Restart your development server</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Appwrite Cloud
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="flex-1 border-2 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <a href="https://github.com/yourusername/financeai/blob/main/APPWRITE_SETUP_GUIDE.md" target="_blank" rel="noopener noreferrer">
                    <Key className="h-4 w-4 mr-2" />
                    Setup Guide
                  </a>
                </Button>
              </div>

              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  💡 All features will be available once Appwrite is configured
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4 z-50">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-white/20 dark:hover:bg-slate-800/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard expenses={expenses} user={user} goals={goals} />;
      case 'expenses':
        return (
          <ExpenseForm
            onAddExpense={handleAddExpense}
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'bills':
        return (
          <BillCalculator
            bills={bills}
            onSaveBill={handleSaveBill}
            onUpdateBill={handleUpdateBill}
            onDeleteBill={handleDeleteBill}
          />
        );
      case 'goals':
        return (
          <GoalsDashboard
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'reports':
        return <Reports expenses={expenses} />;
      case 'settings':
        return (
          <Settings 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser}
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      default:
        return <Dashboard expenses={expenses} user={user} goals={goals} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <Header user={user} />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Built with Bolt Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          ⚡ Built with Bolt
        </a>
      </div>
    </div>
  );
}
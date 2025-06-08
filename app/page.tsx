'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/dashboard';
import { ExpenseForm } from '@/components/expense-form';
import { Reports } from '@/components/reports';
import { Settings } from '@/components/settings';
import { GoalsDashboard } from '@/components/goals-dashboard';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { AuthModal } from '@/components/auth-modal';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Expense, User, FinancialGoal } from '@/types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useLocalStorage<User | null>('financeai_user', null);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('financeai_expenses', []);
  const [goals, setGoals] = useLocalStorage<FinancialGoal[]>('financeai_goals', []);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  // Migrate existing expenses to include type field
  useEffect(() => {
    const migratedExpenses = expenses.map(expense => ({
      ...expense,
      type: expense.type || 'expense' // Default to 'expense' for existing records
    }));
    
    // Only update if there are expenses without type field
    if (expenses.some(expense => !expense.type)) {
      setExpenses(migratedExpenses);
    }
  }, [expenses, setExpenses]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleAddGoal = (goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateGoal = (id: string, goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goalData, id, createdAt: goal.createdAt }
        : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would call your auth API
    const newUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setShowAuthModal(false);
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // Simulate signup - in real app, this would call your auth API
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
    setGoals([]);
    setShowAuthModal(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
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
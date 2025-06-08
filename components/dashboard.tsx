'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Expense, User, FinancialGoal } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Bot, Video, Mic, Sparkles, Target, Zap, Plus, CheckCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { RecentExpenses } from '@/components/recent-expenses';
import { ExpenseChart } from '@/components/expense-chart';
import { AIInsights } from '@/components/ai-insights';
import { VideoAdvisorModal } from '@/components/video-advisor-modal';

interface DashboardProps {
  expenses: Expense[];
  user: User;
  goals?: FinancialGoal[];
}

export function Dashboard({ expenses, user, goals = [] }: DashboardProps) {
  const [showVideoAdvisor, setShowVideoAdvisor] = useState(false);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const lastMonthTransactions = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  // Separate income and expenses
  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthIncome = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = currentMonthIncome - currentMonthExpenses;
  const lastMonthNet = lastMonthIncome - lastMonthExpenses;
  const netChange = lastMonthNet !== 0 ? ((netIncome - lastMonthNet) / Math.abs(lastMonthNet)) * 100 : 0;

  const incomeChange = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseChange = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  const categoryTotals = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
  const savingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0;

  // Goal statistics
  const activeGoals = goals.filter(goal => goal.isActive);
  const completedGoals = goals.filter(goal => (goal.currentAmount / goal.targetAmount) * 100 >= 100);
  const nearCompletionGoals = activeGoals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return progress >= 75 && progress < 100;
  });

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <Sparkles className="h-8 w-8 text-yellow-300" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-xl text-purple-100 mb-6">Your complete financial overview</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">{activeGoals.length} Active Goals</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">{savingsRate.toFixed(1)}% Savings Rate</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse-slow">
                <DollarSign className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Monthly Income</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
              <ArrowUpCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${currentMonthIncome.toFixed(2)}
            </div>
            <div className="flex items-center space-x-1 text-xs mt-2">
              {incomeChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={incomeChange >= 0 ? 'text-emerald-500 font-medium' : 'text-red-500 font-medium'}>
                {Math.abs(incomeChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Monthly Expenses</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600">
              <ArrowDownCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              ${currentMonthExpenses.toFixed(2)}
            </div>
            <div className="flex items-center space-x-1 text-xs mt-2">
              {expenseChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-emerald-500" />
              )}
              <span className={expenseChange >= 0 ? 'text-red-500 font-medium' : 'text-emerald-500 font-medium'}>
                {Math.abs(expenseChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Net Income</CardTitle>
            <div className={`p-2 rounded-full bg-gradient-to-r ${netIncome >= 0 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-pink-600'}`}>
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netIncome >= 0 ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-pink-600'} bg-clip-text text-transparent`}>
              ${netIncome.toFixed(2)}
            </div>
            <div className="flex items-center space-x-1 text-xs mt-2">
              {netChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={netChange >= 0 ? 'text-emerald-500 font-medium' : 'text-red-500 font-medium'}>
                {Math.abs(netChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Goals</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {activeGoals.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {completedGoals.length} completed this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress Section */}
      {activeGoals.length > 0 && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Goal Progress
              </span>
              {nearCompletionGoals.length > 0 && (
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700">
                  {nearCompletionGoals.length} near completion
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-base">
              Track your financial goals and celebrate your achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeGoals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const isNearCompletion = progress >= 75;
                
                return (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      isNearCompletion
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-600'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        {goal.title}
                      </h4>
                      {progress >= 100 && (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={Math.min(100, progress)} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>${goal.currentAmount.toFixed(2)}</span>
                        <span>${goal.targetAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {activeGoals.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No Goals Set</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Start your financial journey by setting your first goal
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Set Your First Goal
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights Section */}
      <AIInsights expenses={expenses} />

      {/* Additional AI Features Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card border-2 border-dashed border-emerald-300 dark:border-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Video Advisor
              </span>
            </CardTitle>
            <CardDescription>
              Interactive AI video agent for personalized advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-300 dark:border-emerald-600">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-3 animate-bounce-slow">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Video Agent Ready</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowVideoAdvisor(true)}
                className="w-full group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all duration-300"
              >
                <Video className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Talk to AI Advisor
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">Tavus</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-2 border-dashed border-orange-300 dark:border-orange-600 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Voice Input
              </span>
            </CardTitle>
            <CardDescription>
              Add transactions using natural voice commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  💬 "I earned $500 from freelance work" or "I spent $15 on lunch"
                </p>
              </div>
              <Button variant="outline" className="w-full group hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white transition-all duration-300" disabled>
                <Mic className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Start Voice Input
                <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700">ElevenLabs</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseChart expenses={currentMonthTransactions.filter(t => t.type === 'expense')} />
        <RecentExpenses expenses={expenses.slice(-10)} />
      </div>

      {/* Video Advisor Modal */}
      <VideoAdvisorModal
        isOpen={showVideoAdvisor}
        onClose={() => setShowVideoAdvisor(false)}
        user={user}
        expenses={expenses}
      />
    </div>
  );
}
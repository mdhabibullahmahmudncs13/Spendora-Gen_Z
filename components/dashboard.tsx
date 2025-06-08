'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Expense, User, FinancialGoal } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Bot, Video, Mic, Sparkles, Target, Zap, Plus, CheckCircle } from 'lucide-react';
import { RecentExpenses } from '@/components/recent-expenses';
import { ExpenseChart } from '@/components/expense-chart';
import { AIInsights } from '@/components/ai-insights';

interface DashboardProps {
  expenses: Expense[];
  user: User;
  goals?: FinancialGoal[];
}

export function Dashboard({ expenses, user, goals = [] }: DashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0;

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
  const avgDailySpending = totalThisMonth / new Date().getDate();

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
              <p className="text-xl text-purple-100 mb-6">Your financial journey continues here</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">{activeGoals.length} Active Goals</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">Streak: 7 days</span>
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
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">This Month</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${totalThisMonth.toFixed(2)}
            </div>
            <div className="flex items-center space-x-1 text-xs mt-2">
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              <span className={monthlyChange >= 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                {Math.abs(monthlyChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Daily Average</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ${avgDailySpending.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Based on current month spending
            </p>
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

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Top Category</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {topCategory ? topCategory[0] : 'None'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              ${topCategory ? topCategory[1].toFixed(2) : '0.00'} spent
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
              <Button variant="outline" className="w-full group hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white transition-all duration-300" disabled>
                <Video className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Talk to AI Advisor
                <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">Tavus</Badge>
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
              Add expenses using natural voice commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  💬 "I spent $15 on lunch at McDonald's"
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
        <ExpenseChart expenses={currentMonthExpenses} />
        <RecentExpenses expenses={expenses.slice(-10)} />
      </div>
    </div>
  );
}
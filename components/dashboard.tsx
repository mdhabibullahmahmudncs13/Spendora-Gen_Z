'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expense, User } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Bot, Video, Mic } from 'lucide-react';
import { RecentExpenses } from '@/components/recent-expenses';
import { ExpenseChart } from '@/components/expense-chart';

interface DashboardProps {
  expenses: Expense[];
  user: User;
}

export function Dashboard({ expenses, user }: DashboardProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Video className="h-4 w-4" />
            AI Advisor
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalThisMonth.toFixed(2)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
              <span className={monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}>
                {Math.abs(monthlyChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgDailySpending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on current month spending
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topCategory ? topCategory[0] : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${topCategory ? topCategory[1].toFixed(2) : '0.00'} spent
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">
              All time tracked expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-dashed border-2 hover:border-primary transition-colors duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              AI Financial Tips
            </CardTitle>
            <CardDescription>
              Get personalized insights based on your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🎯 Based on your spending, consider setting a monthly budget of ${(totalThisMonth * 1.1).toFixed(0)}
                </p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Get More AI Insights
                <Badge variant="secondary" className="ml-2">OpenAI Integration</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 hover:border-primary transition-colors duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5 text-primary" />
              Video Advisor
            </CardTitle>
            <CardDescription>
              Interactive AI video agent for personalized advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Video Agent Placeholder</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Talk to AI Advisor
                <Badge variant="secondary" className="ml-2">Tavus API</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 hover:border-primary transition-colors duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mic className="h-5 w-5 text-primary" />
              Voice Input
            </CardTitle>
            <CardDescription>
              Add expenses using natural voice commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💬 "I spent $15 on lunch at McDonald's"
                </p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Start Voice Input
                <Badge variant="secondary" className="ml-2">ElevenLabs</Badge>
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
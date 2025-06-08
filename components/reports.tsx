'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types';
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Bot } from 'lucide-react';
import { ExpenseChart } from '@/components/expense-chart';
import { CategoryBreakdown } from '@/components/category-breakdown';
import { MonthlyTrends } from '@/components/monthly-trends';

interface ReportsProps {
  expenses: Expense[];
}

export function Reports({ expenses }: ReportsProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of your spending patterns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Analysis
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalThisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {monthNames[currentMonth]} {currentYear}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categoryTotals).length}</div>
            <p className="text-xs text-muted-foreground">
              Active spending categories
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              This month's expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseChart expenses={currentMonthExpenses} />
        <CategoryBreakdown expenses={currentMonthExpenses} />
      </div>

      {/* Monthly Trends */}
      <MonthlyTrends expenses={expenses} />

      {/* AI Insights Section */}
      <Card className="border-dashed border-2 hover:border-primary transition-colors duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Financial Insights
            <Badge variant="secondary">OpenAI Integration</Badge>
          </CardTitle>
          <CardDescription>
            Get personalized financial advice based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 Spending Insight
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your food & dining expenses are 32% higher than the average user. 
                  Consider meal planning to reduce costs.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  🎯 Savings Opportunity
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Based on your patterns, you could save $150/month by optimizing 
                  your transportation and entertainment spending.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                  📊 Budget Recommendation
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Set monthly limits: Food ($400), Transportation ($200), 
                  Entertainment ($150) for better financial control.
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" disabled>
              Generate Detailed AI Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
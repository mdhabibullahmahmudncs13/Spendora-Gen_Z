'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types';
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Bot, Sparkles, Target, Zap, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
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
  
  const currentMonthTransactions = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Separate income and expenses
  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = currentMonthIncome - currentMonthExpenses;
  const savingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0;
  
  const categoryTotals = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeCategoryTotals = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <BarChart3 className="h-8 w-8 text-purple-200" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Financial Reports 📊</h1>
              <p className="text-xl text-purple-100 mb-6">Comprehensive analysis of your income and expenses</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">Monthly Analysis</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">AI Insights</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse-slow">
                <TrendingUp className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" size="sm" className="border-2 border-purple-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" className="border-2 border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 gap-2">
          <Bot className="h-4 w-4" />
          AI Analysis
          <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">Coming Soon</Badge>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {monthNames[currentMonth]} {currentYear}
            </p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {Object.keys(categoryTotals).length} expense categories
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Net Income</CardTitle>
            <div className={`p-2 rounded-full bg-gradient-to-r ${netIncome >= 0 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-pink-600'}`}>
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netIncome >= 0 ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-pink-600'} bg-clip-text text-transparent`}>
              ${netIncome.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {savingsRate.toFixed(1)}% savings rate
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Transactions</CardTitle>
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {currentMonthTransactions.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              This month's transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseChart expenses={currentMonthTransactions.filter(t => t.type === 'expense')} />
        <CategoryBreakdown expenses={currentMonthTransactions.filter(t => t.type === 'expense')} />
      </div>

      {/* Income vs Expenses Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                <ArrowUpCircle className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Income Sources
              </span>
            </CardTitle>
            <CardDescription>Your income breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(incomeCategoryTotals).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(incomeCategoryTotals)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                      <span className="font-medium text-emerald-800 dark:text-emerald-200">{category}</span>
                      <span className="font-bold text-emerald-600">${amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center mx-auto mb-4">
                  <ArrowUpCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300">No income recorded this month</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600">
                <ArrowDownCircle className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Top Expenses
              </span>
            </CardTitle>
            <CardDescription>Your highest spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(categoryTotals).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryTotals)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                      <span className="font-medium text-red-800 dark:text-red-200">{category}</span>
                      <span className="font-bold text-red-600">${amount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4">
                  <ArrowDownCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300">No expenses recorded this month</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <MonthlyTrends expenses={expenses} />

      {/* AI Insights Section */}
      <Card className="gradient-card border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Financial Insights
            </span>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">OpenAI Integration</Badge>
          </CardTitle>
          <CardDescription className="text-base">
            Get personalized financial advice based on your income and spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                  <ArrowUpCircle className="h-4 w-4" />
                  💰 Income Analysis
                </h4>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Your monthly income of ${currentMonthIncome.toFixed(2)} shows {currentMonthIncome > 3000 ? 'strong' : 'moderate'} earning potential. 
                  Consider diversifying income sources for better financial stability.
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  💡 Savings Insight
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your savings rate of {savingsRate.toFixed(1)}% is {savingsRate >= 20 ? 'excellent' : savingsRate >= 10 ? 'good' : 'below recommended'}. 
                  {savingsRate < 20 && ' Aim for 20% to build a strong financial foundation.'}
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  📊 Budget Recommendation
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Based on your income-to-expense ratio, consider the 50/30/20 rule: 
                  50% needs (${(currentMonthIncome * 0.5).toFixed(2)}), 30% wants (${(currentMonthIncome * 0.3).toFixed(2)}), 20% savings (${(currentMonthIncome * 0.2).toFixed(2)}).
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full h-12 border-2 border-blue-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 group" disabled>
              <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
              <span className="font-semibold">Generate Detailed AI Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
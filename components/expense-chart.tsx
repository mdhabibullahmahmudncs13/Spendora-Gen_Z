'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { BarChart3, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  expenses: Expense[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by day for the current month
  const dailyExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).getDate();
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<number, number>);

  // Convert to chart data
  const chartData = Object.entries(dailyExpenses)
    .map(([day, amount]) => ({
      day: `Day ${day}`,
      amount: parseFloat(amount.toFixed(2))
    }))
    .sort((a, b) => parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]));

  if (chartData.length === 0) {
    return (
      <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Daily Spending
            </span>
          </CardTitle>
          <CardDescription>Your spending patterns this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-10 w-10 text-purple-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">No data to display</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add some expenses to see your spending chart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Daily Spending
          </span>
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </CardTitle>
        <CardDescription>Your spending patterns this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis 
                dataKey="day" 
                className="text-slate-500 dark:text-slate-400"
                fontSize={12}
              />
              <YAxis 
                className="text-slate-500 dark:text-slate-400"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Amount']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
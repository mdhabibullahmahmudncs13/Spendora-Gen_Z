'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { TrendingUp, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyTrendsProps {
  expenses: Expense[];
}

export function MonthlyTrends({ expenses }: MonthlyTrendsProps) {
  // Group expenses by month
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data and sort by date
  const chartData = Object.entries(monthlyTotals)
    .map(([month, amount]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: parseFloat(amount.toFixed(2)),
        sortKey: month
      };
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(-12); // Show last 12 months

  if (chartData.length === 0) {
    return (
      <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Monthly Trends
            </span>
          </CardTitle>
          <CardDescription>Your spending trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-orange-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">No trend data available</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Track expenses for multiple months to see trends</p>
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
          <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Monthly Trends
          </span>
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </CardTitle>
        <CardDescription>Your spending trends over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis 
                dataKey="month" 
                className="text-slate-500 dark:text-slate-400"
                fontSize={12}
              />
              <YAxis 
                className="text-slate-500 dark:text-slate-400"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Total Spent']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="url(#lineGradient)" 
                strokeWidth={4}
                dot={{ fill: '#f97316', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, stroke: '#f97316', strokeWidth: 3, fill: '#fff' }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { PieChart as PieChartIcon, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

const COLORS = [
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#8b5a2b', // Brown
  '#6b7280', // Gray
  '#ec4899', // Pink
  '#84cc16'  // Lime
];

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data
  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Category Breakdown
            </span>
          </CardTitle>
          <CardDescription>Spending distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center mx-auto mb-4">
                <PieChartIcon className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">No categories to display</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add expenses to see category breakdown</p>
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
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
            <PieChartIcon className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Category Breakdown
          </span>
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </CardTitle>
        <CardDescription>Spending distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                formatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/types';
import { Clock, DollarSign, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (type: 'income' | 'expense') => {
    return type === 'income' 
      ? 'from-emerald-500 to-teal-600' 
      : 'from-red-500 to-pink-600';
  };

  if (expenses.length === 0) {
    return (
      <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Recent Activity
            </span>
          </CardTitle>
          <CardDescription>Your latest financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-10 w-10 text-blue-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">No transactions recorded yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Start tracking your income and expenses to see activity here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Recent Activity
          </span>
        </CardTitle>
        <CardDescription>Your latest financial transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((transaction, index) => {
            const Icon = getTransactionIcon(transaction.type);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-800 dark:hover:to-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${getTransactionColor(transaction.type)}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                      <Badge variant="outline" className={`${transaction.type === 'income' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200'}`}>
                        {transaction.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 ${transaction.type === 'income' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} rounded-full ml-auto animate-pulse`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
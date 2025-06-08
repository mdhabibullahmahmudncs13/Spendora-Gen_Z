'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/types';
import { Clock, DollarSign } from 'lucide-react';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest expense entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No expenses recorded yet</p>
            <p className="text-sm text-muted-foreground">Start tracking your spending to see activity here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest expense entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">${expense.amount.toFixed(2)}</span>
                  <Badge variant="outline" className="text-xs">
                    {expense.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {expense.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 bg-primary rounded-full ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Expense, EXPENSE_CATEGORIES } from '@/types';
import { PlusCircle, Trash2, Calendar, DollarSign, Mic, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseForm({ onAddExpense, expenses, onDeleteExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const expense: Omit<Expense, 'id'> = {
      amount: parseFloat(amount),
      category,
      description,
      date,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(expense);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    
    toast.success('Expense added successfully! 🎉');
  };

  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <PlusCircle className="h-8 w-8 text-emerald-200" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Track Your Expenses 💰</h1>
          <p className="text-xl text-emerald-100">Smart categorization with AI-powered insights</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Expense Form */}
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                New Expense
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Enter your expense details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount *</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                      <DollarSign className="h-3 w-3 text-white" />
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date *</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the expense"
                  className="min-h-[100px] border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 transition-colors duration-300"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Expense
                </Button>
                <Button type="button" variant="outline" className="h-12 px-6 border-2 border-orange-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white hover:border-transparent transition-all duration-300" disabled>
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Voice Input Feature */}
        <Card className="gradient-card border-2 border-dashed border-orange-300 dark:border-orange-600 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Voice Input
              </span>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200">
                Coming Soon
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              Add expenses using natural voice commands with ElevenLabs integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-dashed border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold mb-4 text-orange-800 dark:text-orange-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Example Commands:
                </h4>
                <ul className="space-y-3 text-sm text-orange-700 dark:text-orange-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    "I spent $15 on lunch at McDonald's"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    "Add $50 for groceries yesterday"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    "Record $120 for gas on Monday"
                  </li>
                </ul>
              </div>
              
              <div className="relative">
                <Button variant="outline" className="w-full h-16 border-2 border-orange-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white hover:border-transparent transition-all duration-300 group" disabled>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 group-hover:bg-white/20">
                      <Mic className="h-5 w-5 text-white group-hover:text-white" />
                    </div>
                    <span className="font-semibold">Start Voice Recording</span>
                  </div>
                </Button>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 animate-pulse"></div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 px-4 py-2">
                  <Zap className="h-3 w-3 mr-1" />
                  ElevenLabs API Integration
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recent Expenses
              </span>
            </CardTitle>
            <CardDescription className="text-base">Your latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense, index) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-800 dark:hover:to-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${expense.amount.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                        {expense.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{expense.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDeleteExpense(expense.id);
                      toast.success('Expense deleted');
                    }}
                    className="text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 transition-all duration-300 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
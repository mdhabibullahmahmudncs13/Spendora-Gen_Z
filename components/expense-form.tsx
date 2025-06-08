'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Expense, EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES } from '@/types';
import { PlusCircle, Trash2, Calendar, DollarSign, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { VoiceInputCard } from '@/components/voice-input-card';
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
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const getTransactionIcon = (transactionType: 'income' | 'expense') => {
    return transactionType === 'income' ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (transactionType: 'income' | 'expense') => {
    return transactionType === 'income' 
      ? 'from-emerald-500 to-teal-600' 
      : 'from-red-500 to-pink-600';
  };

  const getAvailableCategories = () => {
    return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transaction: Omit<Expense, 'id'> = {
      amount: parseFloat(amount),
      category,
      description,
      date,
      type,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(transaction);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully! 🎉`);
  };

  const handleVoiceTransaction = (voiceTransaction: any) => {
    const transaction: Omit<Expense, 'id'> = {
      amount: voiceTransaction.amount,
      category: voiceTransaction.category,
      description: voiceTransaction.description,
      date: voiceTransaction.date,
      type: voiceTransaction.type,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(transaction);
  };

  const recentTransactions = expenses.slice(-5).reverse();

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <PlusCircle className="h-8 w-8 text-blue-200" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Track Your Finances 💰</h1>
          <p className="text-xl text-blue-100">Record both income and expenses with smart categorization and voice input</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Transaction Form */}
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${getTransactionColor(type)}`}>
                {(() => {
                  const IconComponent = getTransactionIcon(type);
                  return <IconComponent className="h-6 w-6 text-white" />;
                })()}
              </div>
              <span className={`bg-gradient-to-r ${getTransactionColor(type)} bg-clip-text text-transparent`}>
                New {type === 'income' ? 'Income' : 'Expense'}
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Enter your {type === 'income' ? 'income' : 'expense'} details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transaction Type *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TRANSACTION_TYPES.map((transactionType) => {
                    const IconComponent = getTransactionIcon(transactionType);
                    return (
                      <button
                        key={transactionType}
                        type="button"
                        onClick={() => {
                          setType(transactionType);
                          setCategory(''); // Reset category when type changes
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          type === transactionType
                            ? `bg-gradient-to-r ${getTransactionColor(transactionType)} text-white border-transparent shadow-lg`
                            : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className={`p-2 rounded-xl ${type === transactionType ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="font-semibold capitalize">{transactionType}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount *</Label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r ${getTransactionColor(type)}`}>
                      <DollarSign className="h-3 w-3 text-white" />
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-${type === 'income' ? 'emerald' : 'red'}-500 transition-colors duration-300`}
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
                    <SelectValue placeholder={`Select ${type} category`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCategories().map((cat) => (
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
                  placeholder={`Brief description of the ${type}`}
                  className="min-h-[100px] border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 transition-colors duration-300"
                  required
                />
              </div>
              
              <Button type="submit" className={`w-full h-12 bg-gradient-to-r ${getTransactionColor(type)} hover:from-${type === 'income' ? 'emerald' : 'red'}-600 hover:to-${type === 'income' ? 'teal' : 'pink'}-700 text-white font-semibold transition-all duration-300 transform hover:scale-105`}>
                <PlusCircle className="h-5 w-5 mr-2" />
                Add {type === 'income' ? 'Income' : 'Expense'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Voice Input Feature */}
        <VoiceInputCard onTransactionParsed={handleVoiceTransaction} />
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recent Transactions
              </span>
            </CardTitle>
            <CardDescription className="text-base">Your latest financial entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => {
                const IconComponent = getTransactionIcon(transaction.type);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-800 dark:hover:to-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${getTransactionColor(transaction.type)}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xl font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </span>
                          <Badge variant="outline" className={`${transaction.type === 'income' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200'}`}>
                            {transaction.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{transaction.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onDeleteExpense(transaction.id);
                        toast.success('Transaction deleted');
                      }}
                      className="text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 transition-all duration-300 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
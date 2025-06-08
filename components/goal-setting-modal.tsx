'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FinancialGoal, EXPENSE_CATEGORIES, GOAL_TYPES, GOAL_PERIODS } from '@/types';
import { Target, DollarSign, Calendar, Save, X, Sparkles, TrendingUp, PiggyBank, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  editingGoal?: FinancialGoal | null;
}

export function GoalSettingModal({ isOpen, onClose, onSaveGoal, editingGoal }: GoalSettingModalProps) {
  const [title, setTitle] = useState(editingGoal?.title || '');
  const [description, setDescription] = useState(editingGoal?.description || '');
  const [targetAmount, setTargetAmount] = useState(editingGoal?.targetAmount?.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(editingGoal?.currentAmount?.toString() || '0');
  const [category, setCategory] = useState(editingGoal?.category || '');
  const [type, setType] = useState<string>(editingGoal?.type || 'spending');
  const [period, setPeriod] = useState<string>(editingGoal?.period || 'monthly');
  const [startDate, setStartDate] = useState(editingGoal?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(editingGoal?.endDate?.split('T')[0] || '');
  const [loading, setLoading] = useState(false);

  const getGoalIcon = (goalType: string) => {
    switch (goalType) {
      case 'spending': return <Wallet className="h-4 w-4" />;
      case 'saving': return <PiggyBank className="h-4 w-4" />;
      case 'income': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getGoalColor = (goalType: string) => {
    switch (goalType) {
      case 'spending': return 'from-red-500 to-pink-600';
      case 'saving': return 'from-emerald-500 to-teal-600';
      case 'income': return 'from-blue-500 to-indigo-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  const calculateEndDate = (start: string, selectedPeriod: string) => {
    const startDateObj = new Date(start);
    let endDateObj = new Date(startDateObj);

    switch (selectedPeriod) {
      case 'weekly':
        endDateObj.setDate(startDateObj.getDate() + 7);
        break;
      case 'monthly':
        endDateObj.setMonth(startDateObj.getMonth() + 1);
        break;
      case 'yearly':
        endDateObj.setFullYear(startDateObj.getFullYear() + 1);
        break;
      default:
        return endDate; // Keep custom date
    }

    return endDateObj.toISOString().split('T')[0];
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom' && startDate) {
      setEndDate(calculateEndDate(startDate, newPeriod));
    }
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    if (period !== 'custom') {
      setEndDate(calculateEndDate(newStartDate, period));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetAmount || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(targetAmount) <= 0) {
      toast.error('Target amount must be greater than 0');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const goal: Omit<FinancialGoal, 'id' | 'createdAt'> = {
        title: title.trim(),
        description: description.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        category: category || undefined,
        type: type as any,
        period: period as any,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isActive: true,
      };
      
      onSaveGoal(goal);
      toast.success(editingGoal ? 'Goal updated successfully! 🎯' : 'Goal created successfully! 🎯');
      handleClose();
    } catch (error) {
      toast.error('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setCurrentAmount('0');
    setCategory('');
    setType('spending');
    setPeriod('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl gradient-card border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {editingGoal ? 'Edit Financial Goal' : 'Set Financial Goal'}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Goal Type Selection */}
          <div className="grid grid-cols-3 gap-3">
            {GOAL_TYPES.map((goalType) => (
              <button
                key={goalType}
                type="button"
                onClick={() => setType(goalType)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  type === goalType
                    ? `bg-gradient-to-r ${getGoalColor(goalType)} text-white border-transparent shadow-lg`
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-xl ${type === goalType ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {getGoalIcon(goalType)}
                  </div>
                  <span className="text-sm font-semibold capitalize">{goalType}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Goal Title *
              </Label>
              <Input
                id="goal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Monthly Food Budget"
                className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category (Optional)
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific category</SelectItem>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="goal-description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your financial goal and why it's important to you"
              className="min-h-[80px] border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 transition-colors duration-300"
            />
          </div>

          {/* Amount Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Target Amount *
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                  <DollarSign className="h-3 w-3 text-white" />
                </div>
                <Input
                  id="target-amount"
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 transition-colors duration-300"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current-amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Current Amount
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                  <DollarSign className="h-3 w-3 text-white" />
                </div>
                <Input
                  id="current-amount"
                  type="number"
                  step="0.01"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          {/* Time Period */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Time Period *
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {GOAL_PERIODS.map((goalPeriod) => (
                <button
                  key={goalPeriod}
                  type="button"
                  onClick={() => handlePeriodChange(goalPeriod)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    period === goalPeriod
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600'
                  }`}
                >
                  <span className="text-sm font-semibold capitalize">{goalPeriod}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Start Date *
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 transition-colors duration-300"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                End Date *
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={period !== 'custom'}
                  className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 transition-colors duration-300 disabled:opacity-50"
                  required
                />
              </div>
              {period !== 'custom' && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-calculated based on selected period
                </p>
              )}
            </div>
          </div>

          {/* Progress Preview */}
          {targetAmount && currentAmount && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Goal Progress Preview
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700 dark:text-purple-300">Progress</span>
                  <span className="font-semibold text-purple-800 dark:text-purple-200">
                    {((parseFloat(currentAmount) / parseFloat(targetAmount)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (parseFloat(currentAmount) / parseFloat(targetAmount)) * 100)}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400">
                  <span>${parseFloat(currentAmount).toFixed(2)}</span>
                  <span>${parseFloat(targetAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
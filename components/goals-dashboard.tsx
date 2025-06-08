'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FinancialGoal } from '@/types';
import { Target, Plus, Edit3, Trash2, Calendar, DollarSign, TrendingUp, PiggyBank, Wallet, Sparkles, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { GoalSettingModal } from '@/components/goal-setting-modal';
import { toast } from 'sonner';

interface GoalsDashboardProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsDashboard({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsDashboardProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'spending': return <Wallet className="h-5 w-5" />;
      case 'saving': return <PiggyBank className="h-5 w-5" />;
      case 'income': return <TrendingUp className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'spending': return 'from-red-500 to-pink-600';
      case 'saving': return 'from-emerald-500 to-teal-600';
      case 'income': return 'from-blue-500 to-indigo-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  const getGoalStatus = (goal: FinancialGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const endDate = new Date(goal.endDate);
    const now = new Date();
    const isExpired = endDate < now;
    
    if (progress >= 100) return { status: 'completed', color: 'emerald', icon: CheckCircle };
    if (isExpired) return { status: 'expired', color: 'red', icon: AlertTriangle };
    if (progress >= 75) return { status: 'on-track', color: 'blue', icon: TrendingUp };
    return { status: 'in-progress', color: 'orange', icon: Clock };
  };

  const formatPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleSaveGoal = (goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      onUpdateGoal(editingGoal.id, goalData);
    } else {
      onAddGoal(goalData);
    }
    setEditingGoal(null);
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (id: string) => {
    onDeleteGoal(id);
    toast.success('Goal deleted successfully');
  };

  const activeGoals = goals.filter(goal => goal.isActive);
  const completedGoals = goals.filter(goal => !goal.isActive || (goal.currentAmount / goal.targetAmount) * 100 >= 100);

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20"></div>
        <div className="absolute top-4 right-4 animate-float">
          <Target className="h-8 w-8 text-purple-200" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Financial Goals 🎯</h1>
              <p className="text-xl text-purple-100 mb-6">Track your progress and achieve your financial dreams</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">{activeGoals.length} Active Goals</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{completedGoals.length} Completed</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse-slow">
                <Target className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowGoalModal(true)}
          className="h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Set New Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {activeGoals.length === 0 ? (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4">
              <Target className="h-10 w-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">No Goals Set Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start your financial journey by setting your first goal
            </p>
            <Button
              onClick={() => setShowGoalModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const status = getGoalStatus(goal);
            const daysRemaining = getDaysRemaining(goal.endDate);
            const StatusIcon = status.icon;

            return (
              <Card key={goal.id} className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${getGoalColor(goal.type)}`}>
                        {getGoalIcon(goal.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          {goal.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`bg-gradient-to-r from-${status.color}-100 to-${status.color}-100 text-${status.color}-700 border-${status.color}-200`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {formatPeriod(goal.period)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditGoal(goal)}
                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {goal.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.min(100, progress)} className="h-3" />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>${goal.currentAmount.toFixed(2)}</span>
                      <span>${goal.targetAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                      </span>
                    </div>
                    {goal.category && (
                      <Badge variant="outline" className="text-xs">
                        {goal.category}
                      </Badge>
                    )}
                  </div>

                  {/* Remaining Amount */}
                  <div className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {goal.type === 'spending' ? 'Budget Remaining' : 'Amount Needed'}
                      </span>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${Math.max(0, goal.targetAmount - goal.currentAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Setting Modal */}
      <GoalSettingModal
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        editingGoal={editingGoal}
      />
    </div>
  );
}